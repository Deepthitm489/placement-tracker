const mongoose = require('mongoose');

let cachedConnection = null;

const connectDB = async () => {
  if (process.env.NODE_ENV === 'test') {
    return null;
  }

  // 1. If already connected, reuse existing connection
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  // 2. If connection is already in flight, await it
  if (cachedConnection) {
    try {
      await cachedConnection;
      if (mongoose.connection.readyState === 1) {
        return mongoose.connection;
      }
    } catch {
      cachedConnection = null;
    }
  }

  try {
    let mongoUri = (process.env.MONGODB_URI || process.env.MONGO_URI || '').trim();

    const isCloudOrProduction =
      process.env.NODE_ENV === 'production' ||
      Boolean(process.env.RENDER) ||
      Boolean(process.env.VERCEL);

    const isLocalhostUri =
      mongoUri.includes('127.0.0.1') ||
      mongoUri.includes('localhost') ||
      mongoUri.includes('::1');

    // Guard against attempting loopback connection in cloud
    if (isCloudOrProduction && (!mongoUri || isLocalhostUri)) {
      console.warn('⚠️ MONGODB_URI is not configured with a remote MongoDB Atlas URI in cloud environment.');
      return null;
    }

    if (!mongoUri) {
      mongoUri = 'mongodb://127.0.0.1:27017/placement_tracker';
      console.log(`[Development] Connecting to local MongoDB at: ${mongoUri}`);
    }

    const sanitizedUri = mongoUri.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@');
    console.log(`Connecting to MongoDB at: ${sanitizedUri}`);

    cachedConnection = mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
      autoIndex: process.env.NODE_ENV !== 'production',
    });

    const conn = await cachedConnection;
    console.log(`✅ MongoDB Connected successfully: ${conn.connection.host} (DB: ${conn.connection.name})`);
    return conn;
  } catch (error) {
    cachedConnection = null;
    if (error.message && error.message.includes('ECONNREFUSED 127.0.0.1')) {
      console.warn('⚠️ Local MongoDB daemon is not running at 127.0.0.1:27017.');
    } else {
      console.error(`❌ MongoDB Connection Error: ${error.message}`);
    }
    throw error;
  }
};

module.exports = connectDB;
