import { connectDB } from './lib/db.js';
import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRoutes from './routes/auth.route.js';
import docRoutes from './routes/doc.route.js';
import { app, serverHttp } from './socket.js';

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/documents', docRoutes);
serverHttp.listen(process.env.PORT || 5000, () => {
  console.log('Server listening on port ', process.env.PORT || 5000);
  connectDB();
});
