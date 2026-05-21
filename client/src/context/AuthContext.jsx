import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  signOut, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile as firebaseUpdateProfile
} from 'firebase/auth';
import { auth, googleProvider, githubProvider } from '../firebase/config';
import axios from 'axios';
import { io } from 'socket.io-client';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [dbUser, setDbUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);

  const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  });

  api.interceptors.request.use(async (config) => {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  const syncUserWithDb = async (firebaseUser) => {
    try {
      const response = await api.post('/auth/sync', {
        name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
        email: firebaseUser.email,
        firebaseUid: firebaseUser.uid,
        avatar: firebaseUser.photoURL,
      });
      setDbUser(response.data);
      return response.data;
    } catch (error) {
      console.error('Error syncing user:', error);
      return null;
    }
  };

  useEffect(() => {
    let activeSocket = null;

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        const syncedUser = await syncUserWithDb(user);
        if (syncedUser) {
          // Establish socket connection
          const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
          activeSocket = io(socketUrl);
          setSocket(activeSocket);

          // Join private channel
          activeSocket.emit('join', syncedUser._id);

          // Listen for notifications
          activeSocket.on('notification', (notification) => {
            toast.info(notification.message, {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              icon: '🔔'
            });
          });
        }
      } else {
        setDbUser(null);
        if (activeSocket) {
          activeSocket.disconnect();
          setSocket(null);
        }
      }
      setLoading(false);
    });

    return () => {
      unsubscribe();
      if (activeSocket) {
        activeSocket.disconnect();
      }
    };
  }, []);

  const login = (email, password) => signInWithEmailAndPassword(auth, email, password);
  const signup = (email, password) => createUserWithEmailAndPassword(auth, email, password);
  
  const logout = async () => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
    }
    return signOut(auth);
  };

  const resetPassword = (email) => sendPasswordResetEmail(auth, email);
  const googleLogin = () => signInWithPopup(auth, googleProvider);
  const githubLogin = () => signInWithPopup(auth, githubProvider);

  const value = {
    currentUser,
    dbUser,
    loading,
    login,
    signup,
    logout,
    resetPassword,
    googleLogin,
    githubLogin,
    api,
    socket,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
