import 'dotenv/config';
import setupDNS from './utils/dns.js';

// Setup DNS for development
setupDNS();

import express from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import mongoSanitize from 'express-mongo-sanitize';
import { rateLimit } from 'express-rate-limit';
import connectDB from './config/db.js';
import { connectRedis } from './config/redis.js';

import auth from './routes/authRoutes.js';
import teacher from './routes/teacherRoutes.js';
import student from './routes/studentRoutes.js';
import admin from './routes/adminRoutes.js';
import assignments from './routes/assignmentRoutes.js';
import announcements from './routes/announcementRoutes.js';
import { initSocket } from './socket.js';

// Initialize Express
const app = express();
const server = http.createServer(app);

// Connect to Databases
connectDB();
connectRedis();

// Initialize Socket.io
await initSocket(server);

// Middleware
app.use(helmet()); // Security headers
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true })); // CORS
app.use(express.json()); // Body parser
app.use(cookieParser()); // Cookie parser

// Express 5 req.query compatibility fix for express-mongo-sanitize
app.use((req, res, next) => {
    const query = { ...req.query };
    Object.defineProperty(req, 'query', {
        value: query,
        writable: true,
        enumerable: true,
        configurable: true
    });
    next();
});

app.use(mongoSanitize()); // Prevent NoSQL Injection
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev')); // Logging
}

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use('/api/', limiter);

// Basic Route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to DJ Science College Student Portal API' });
});

app.use('/api/auth', auth);
app.use('/api/teacher', teacher);
app.use('/api/student', student);
app.use('/api/admin', admin);
app.use('/api/assignments', assignments);
app.use('/api/announcements', announcements);

// Health Check
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'UP', timestamp: new Date() });
});

// Error Handling Middleware (Placeholder)
app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

