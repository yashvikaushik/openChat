import dotenv from 'dotenv';
import path from 'path';
// Load environment variables first
dotenv.config({ path: path.join(__dirname, '../.env') });

import app from './app';
import { connectDB } from './config/db';

const PORT = process.env.PORT || 3000;
console.log('Loaded MONGODB_URI:', process.env.MONGODB_URI);

const startServer = async () => {
  try {
    // Connect to Database and Seed rooms
    await connectDB();

    app.listen(PORT, () => {
      console.log(`[Server] Running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });
  } catch (err) {
    console.error('[Server] Failed to start server:', err);
    process.exit(1);
  }
};

startServer();
