import express from 'express';
import path from 'path';
import cors from 'cors';
import loggerMiddleware from './middleware/logger.middleware';
import notFoundMiddleware from './middleware/notFound.middleware';
import errorMiddleware from './middleware/error.middleware';
import roomRoutes from './routes/room.routes';
import messageRoutes from './routes/message.routes';

const app = express();

// Global Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(loggerMiddleware);

// Serve Frontend Static Files
app.use(express.static(path.join(__dirname, '../../frontend')));

// API Routes
app.use('/api/rooms', roomRoutes);
app.use('/api/messages', messageRoutes);

// Fallback to index.html for undefined frontend/SPA routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/index.html'));
});

// Unknown API routes handler
app.use('/api/*', notFoundMiddleware);

// Error handling middleware
app.use(errorMiddleware);

export default app;
