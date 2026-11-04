const mongoose = require('mongoose');

const connectDB = async () => {
  if (process.env.NODE_ENV === 'test') {
    return;
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

    // 1. Guard against connecting to localhost/127.0.0.1 in cloud environments (e.g. Render)
    if (isCloudOrProduction && (!mongoUri || isLocalhostUri)) {
      console.warn('================================================================================');
      console.warn('⚠️  MONGODB ATLAS CONFIGURATION NOTICE (Render Cloud Environment):');
      console.warn('Your backend is running in production, but MONGODB_URI is either not set or is');
      console.warn('pointing to localhost/127.0.0.1 (which does not exist inside a cloud container).');
      console.warn('');
      console.warn('To connect to your database:');
      console.warn('  1. Open your Render Dashboard -> Your Service -> "Environment" tab.');
      console.warn('  2. Add or update the MONGODB_URI environment variable with your MongoDB Atlas string:');
      console.warn('     MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/placement_tracker?retryWrites=true&w=majority');
      console.warn('  3. In MongoDB Atlas, verify that "Network Access" allows 0.0.0.0/0 (Anywhere).');
      console.warn('');
      console.warn('The API server is running and /api/health is online so health checks will pass.');
      console.warn('================================================================================');
      return;
    }

    // 2. In local development without MONGODB_URI set, default to local daemon
    if (!mongoUri) {
      mongoUri = 'mongodb://127.0.0.1:27017/placement_tracker';
      console.log(`[Development] No MONGODB_URI provided in .env, attempting local MongoDB at: ${mongoUri}`);
    }

    // Mask credentials in logs for security
    const sanitizedUri = mongoUri.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@');
    console.log(`Connecting to MongoDB at: ${sanitizedUri}`);

    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 8000,
      autoIndex: process.env.NODE_ENV !== 'production',
    });

    console.log(`✅ MongoDB Connected successfully: ${conn.connection.host} (DB: ${conn.connection.name})`);
    return conn;
  } catch (error) {
    if (error.message && error.message.includes('ECONNREFUSED 127.0.0.1')) {
      console.warn('================================================================================');
      console.warn('⚠️  LOCAL MONGODB NOT DETECTED (ECONNREFUSED 127.0.0.1:27017):');
      console.warn('No local MongoDB daemon is running on this machine at port 27017.');
      console.warn('To connect:');
      console.warn('  Option A (Recommended): Paste your MongoDB Atlas URI into backend/.env:');
      console.warn('    MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.abcde.mongodb.net/placement_tracker?retryWrites=true&w=majority');
      console.warn('  Option B: Start local MongoDB service (e.g. `mongod` or `net start MongoDB`).');
      console.warn('================================================================================');
    } else {
      console.error(`❌ MongoDB Connection Error: ${error.message}`);
      if (process.env.NODE_ENV === 'production') {
        console.error('⚠️  Failed to reach MongoDB Atlas cluster. Please check:');
        console.error('  1. Network Access in MongoDB Atlas has 0.0.0.0/0 (allow from anywhere) enabled.');
        console.error('  2. Database user credentials (username/password) are correct in MONGODB_URI.');
        console.error('  3. The database name is specified in the URI path.');
      }
    }
  }
};

module.exports = connectDB;
