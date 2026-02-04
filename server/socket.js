const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const User = require("./models/User");

let io;

const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: process.env.CORS_ORIGIN || "http://localhost:3000",
            methods: ["GET", "POST"],
            credentials: true
        }
    });

    // Authentication Middleware for Sockets
    io.use(async (socket, next) => {
        const token = socket.handshake.auth.token;
        if (!token) return next(new Error("Authentication error"));

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            socket.user = await User.findById(decoded.id);
            next();
        } catch (err) {
            next(new Error("Authentication error"));
        }
    });

    io.on("connection", (socket) => {
        console.log(`User connected: ${socket.user.name} (${socket.id})`);

        // Join personal room
        socket.join(`user:${socket.user._id}`);

        // Join class rooms
        if (socket.user.classes && socket.user.classes.length > 0) {
            socket.user.classes.forEach(classId => {
                socket.join(`class:${classId}`);
                console.log(`User ${socket.user.name} joined class:${classId}`);
            });
        }

        socket.on("disconnect", () => {
            console.log(`User disconnected: ${socket.id}`);
        });
    });

    return io;
};

const getIO = () => {
    if (!io) {
        throw new Error("Socket.io not initialized!");
    }
    return io;
};

// Utility to emit to specific user
const emitToUser = (userId, event, data) => {
    io.to(`user:${userId}`).emit(event, data);
};

// Utility to emit to class
const emitToClass = (classId, event, data) => {
    io.to(`class:${classId}`).emit(event, data);
};

module.exports = { initSocket, getIO, emitToUser, emitToClass };
