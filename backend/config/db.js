const mongoose = require('mongoose');

const connectDB = async () => {
  if (process.env.NODE_ENV === 'test') {
    return;
  }
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;

    if (!mongoUri) {
      if (process.env.NODE_ENV === 'production') {
        console.error('================================================================================');
        console.error('⚠️  CRITICAL CONFIGURATION NOTICE (Render Production):');
        console.error('Neither MONGODB_URI nor MONGO_URI is defined in your environment variables.');
        console.error('The server will start so /api/health is reachable, but database operations');
        console.error('will fail until you add MONGODB_URI in your Render service environment settings.');
        console.error('================================================================================');
        return;
      } else {
        // Development fallback only
        const devUri = 'mongodb://127.0.0.1:27017/placement_tracker';
        console.log(`[Development] Connecting to local MongoDB at: ${devUri}`);
        const conn = await mongoose.connect(devUri, { serverSelectionTimeoutMS: 5000 });
        console.log(`[Development] MongoDB Connected: ${conn.connection.host}`);
        return conn;
      }
    }

    // Mask credentials in logs for security
    const sanitizedUri = mongoUri.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@');
    console.log(`Connecting to MongoDB Atlas at: ${sanitizedUri}`);

    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
      autoIndex: process.env.NODE_ENV !== 'production',
    });

    console.log(`✅ MongoDB Connected successfully: ${conn.connection.host} (DB: ${conn.connection.name})`);
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    if (process.env.NODE_ENV === 'production') {
      console.error('⚠️  Could not establish initial connection to MongoDB Atlas. Check:');
      console.error('  1. Network Access in MongoDB Atlas has 0.0.0.0/0 (allow from anywhere) enabled.');
      console.error('  2. Database user credentials (username/password) are correct in MONGODB_URI.');
      console.error('  3. The database name is specified in the URI path.');
      // Keep server alive so Render health check can respond with status diagnostics
    }
  }
};

module.exports = connectDB;
