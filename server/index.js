const express = require('express');
const mongoose = require('./config/db');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const morgan = require('morgan');
const helmet = require('helmet');
const http = require('http');
const { Server } = require('socket.io');
require('./config/firebase'); // Initialize Firebase Admin

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
// Rate limiting middleware for all API routes
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', apiLimiter);

// Socket.io connection
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('join', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their room`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Pass io to request
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));
// admin and AI routes removed as they are not required per specification;

app.get('/', (req, res) => {
  res.send('Task Management API is running...');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await mongoose.connect();
  } catch (err) {
    console.warn('⚠️  Database connection failed:', err.message);
  }

  // Only start listening if not running in a serverless environment like Vercel
  if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  }
};

startServer();

// Export the Express app for Vercel Serverless Functions
module.exports = app;
