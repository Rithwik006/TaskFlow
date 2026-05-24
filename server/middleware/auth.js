const admin = require('firebase-admin');
const User = require('../models/User');

const jwt = require('jsonwebtoken');

const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    let decodedToken;
    
    // Check if Firebase Admin is initialized with credentials
    if (admin.apps.length > 0 && admin.app().options.credential) {
      decodedToken = await admin.auth().verifyIdToken(token);
    } else {
      // Dev mode fallback: decode token directly without verifying signature
      // this allows the app to run without requiring a Firebase Service Account JSON in .env
      decodedToken = jwt.decode(token);
      if (decodedToken) {
        decodedToken.uid = decodedToken.uid || decodedToken.user_id || decodedToken.sub;
      }
    }

    if (!decodedToken || !decodedToken.uid) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    const user = await User.findOne({ firebaseUid: decodedToken.uid });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.status === 'Suspended') {
      return res.status(403).json({ message: 'User account is suspended' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'Admin') {
    next();
  } else {
    res.status(403).json({ message: 'Require Admin Role!' });
  }
};

module.exports = { verifyToken, isAdmin };
