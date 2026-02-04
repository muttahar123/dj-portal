require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');

// Route files
const auth = require('./routes/authRoutes');
const teacher = require('./routes/teacherRoutes');
const student = require('./routes/studentRoutes');
const admin = require('./routes/adminRoutes');
const assignments = require('./routes/assignmentRoutes');
const { initSocket } = require('./socket');

// Initialize Express
const app = express();
const server = http.createServer(app);

// Connect to Database
connectDB();

// Initialize Socket.io
initSocket(server);

// Middleware
app.use(helmet()); // Security headers
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true })); // CORS
app.use(express.json()); // Body parser
app.use(cookieParser()); // Cookie parser
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

// Mount routers
app.use('/api/auth', auth);
app.use('/api/teacher', teacher);
app.use('/api/student', student);
app.use('/api/admin', admin);
app.use('/api/assignments', assignments);

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
