import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import examRoutes from './routes/exam.route.js';
import availabilityRoutes from './routes/availability.route.js';
import reportRoutes from './routes/report.route.js';
import shiftRoutes from './routes/shift.route.js';
import teamRoutes from './routes/team.route.js';
import stockRoutes from './routes/stock.route.js';
import AuditRoutes from './routes/audit.route.js';
import cookieParser from 'cookie-parser';
import path from 'path';
import cors from 'cors';
import { WebSocketServer } from 'ws'; // Import the 'ws' package
dotenv.config();

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.info('Connected to MongoDB');
  })
  .catch((err) => {
    console.error(err);
  });

const __dirname = path.resolve();

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.set('trust proxy', true);

app.use(express.static(path.join(__dirname, '/client/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

app.use(express.json());

app.use(cookieParser());

const server = app.listen(3000, () => {
  console.info('Server listening on port 3000');
});

// Create a WebSocket server
const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  console.info('A client connected');

  // Handle messages from the client
  ws.on('message', (message) => {
    console.info('Received message:', message.toString());
    // You can handle the message here
  });

  // Handle WebSocket closing
  ws.on('close', () => {
    console.info('Client disconnected');
  });
});

const apiVersion = 1;

app.use(`/api/v${apiVersion}/user`, userRoutes);
app.use(`/api/v${apiVersion}/auth`, authRoutes);
app.use(`/api/v${apiVersion}/exam`, examRoutes)
app.use(`/api/v${apiVersion}/availability`, availabilityRoutes)
app.use(`/api/v${apiVersion}/report`, reportRoutes)
app.use(`/api/v${apiVersion}/shift`, shiftRoutes)
app.use(`/api/v${apiVersion}/team`, teamRoutes)
app.use(`/api/v${apiVersion}/stock`, stockRoutes)
app.use(`/api/v${apiVersion}/audit`, AuditRoutes)


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