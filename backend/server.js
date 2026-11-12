const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const { sanitizeInput } = require('./middleware/sanitize');

// Route files
const authRoutes = require('./routes/authRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Security HTTP Headers (Helmet)
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);

// Body Parser Middleware
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// NoSQL Injection Sanitization
app.use(sanitizeInput);

// Rate Limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // Limit each IP to 500 requests per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this network origin. Please try again in 15 minutes.',
  },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 40, // Limit login / registration attempts
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts. Please wait 15 minutes before retrying.',
  },
});

app.use('/api', apiLimiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// Enable CORS
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:4173',
  'http://127.0.0.1:5173',
  'https://frontend-three-delta-91.vercel.app',
  process.env.CLIENT_URL,
]
  .filter(Boolean)
  .map((url) => url.trim().replace(/\/+$/, ''));

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or Postman)
      if (!origin) return callback(null, true);

      const normalizedOrigin = origin.trim().replace(/\/+$/, '');

      // Allow if explicit match
      if (allowedOrigins.includes(normalizedOrigin)) {
        return callback(null, true);
      }

      // Allow any Vercel domain (previews, production aliases)
      if (normalizedOrigin.endsWith('.vercel.app')) {
        return callback(null, true);
      }

      // Allow any Render domain
      if (normalizedOrigin.endsWith('.onrender.com')) {
        return callback(null, true);
      }

      // In non-production, allow all
      if (process.env.NODE_ENV !== 'production') {
        return callback(null, true);
      }

      return callback(new Error(`Blocked by CORS policy: Origin ${origin} not permitted.`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// HTTP request logging in development
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Health Check Endpoints (/api/health and /health)
const getHealthStatus = (req, res) => {
  const isConnected = mongoose.connection.readyState === 1;
  const isConnecting = mongoose.connection.readyState === 2;
  const dbStatus = isConnected ? 'connected' : isConnecting ? 'connecting' : 'disconnected';

  const rawUri = (process.env.MONGODB_URI || process.env.MONGO_URI || '').trim();
  const isAtlasConfigured = Boolean(
    rawUri &&
    !rawUri.includes('127.0.0.1') &&
    !rawUri.includes('localhost')
  );

  res.status(200).json({
    status: 'healthy',
    message: 'Placement Tracker API is running smoothly',
    timestamp: new Date().toISOString(),
    uptime: `${process.uptime().toFixed(1)}s`,
    database: {
      status: dbStatus,
      readyState: mongoose.connection.readyState,
      atlasConfigured: isAtlasConfigured,
      note: isConnected
        ? 'MongoDB Atlas is connected and active'
        : isAtlasConfigured
        ? 'Connecting to MongoDB Atlas cluster...'
        : 'Please set MONGODB_URI in Render service Environment variables with your MongoDB Atlas connection string',
    },
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0',
  });
};

app.get('/api/health', getHealthStatus);
app.get('/health', getHealthStatus);

// Fail fast with clear JSON error when database is unavailable
const requireDB = (req, res, next) => {
  if (process.env.NODE_ENV !== 'test' && mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      success: false,
      message: 'Database connection is unavailable. Please configure MONGODB_URI and ensure MongoDB Atlas Network Access allows 0.0.0.0/0.',
    });
  }
  next();
};

// Mount Routers
app.use('/api/auth', requireDB, authRoutes);
app.use('/api/applications', requireDB, applicationRoutes);
app.use('/api/dashboard', requireDB, dashboardRoutes);
app.use('/api/notifications', requireDB, notificationRoutes);

// Root Welcome Endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Placement Tracker API',
    status: 'online',
    documentation: '/api/health',
  });
});

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0';

let server;
if (process.env.NODE_ENV !== 'test') {
  server = app.listen(PORT, HOST, () => {
    console.log(`====================================================`);
    console.log(`🚀 Placement Tracker API running in ${process.env.NODE_ENV || 'development'} mode`);
    console.log(`📍 Listening on: http://${HOST}:${PORT}`);
    console.log(`🩺 Health check available at: http://${HOST}:${PORT}/api/health`);
    console.log(`====================================================`);
  });
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection Error: ${err.message}`);
});

module.exports = app;
