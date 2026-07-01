import dotenv from 'dotenv';
import path from 'path';
// Load environment variables first
dotenv.config({ path: path.join(__dirname, '../.env') });


import http from 'http';
import app from './app';
import { connectDB } from './config/db';
import { initializeSocket } from './config/socket';

const PORT = process.env.PORT || 3000;
console.log('Loaded MONGODB_URI:', process.env.MONGODB_URI);

const startServer = async () => {
  try {
    console.log("server initialization started");
    // Connect to Database and Seed rooms
    await connectDB();

    // Wrap Express app in HTTP server to enable Socket.IO connection handling
    const httpServer = http.createServer(app);

    initializeSocket(httpServer);
    console.log("socket connected with http server successfuly");

    httpServer.listen(PORT, () => {
      console.log(`[Server] Running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });
  } catch (err) {
    console.error('[Server] Failed to start server:', err);
    process.exit(1);
  }
};

startServer();
