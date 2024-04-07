import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import examRoutes from './routes/exam.route.js';
import availabilityRoutes from './routes/availability.route.js';
import reportRoutes from './routes/report.route.js';
import shiftRoutes from './routes/shift.route.js';
import cookieParser from 'cookie-parser';
import path from 'path';
import cors from 'cors';
import { WebSocketServer } from 'ws'; // Import the 'ws' package
dotenv.config();

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.log(err);
  });

const __dirname = path.resolve();

const app = express();

app.use(express.static(path.join(__dirname, '/client/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

app.use(cors());

app.use(express.json());

app.use(cookieParser());

const server = app.listen(3000, () => {
  console.log('Server listening on port 3000');
});

// Create a WebSocket server
const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  console.log('A client connected');

  // Handle messages from the client
  ws.on('message', (message) => {
    console.log('Received message:', data);
    // You can handle the message here
  });

  // Handle WebSocket closing
  ws.on('close', () => {
    console.log('Client disconnected');
  });

});

app.use('/api/v1/user', userRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/exam', examRoutes)
app.use('/api/v1/availability', availabilityRoutes)
app.use('/api/v1/report', reportRoutes)
app.use('/api/v1/shift', shiftRoutes)

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  return res.status(statusCode).json({
    success: false,
    message,
    statusCode,
  });
});

export { wss };