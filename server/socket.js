import { Server } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import jwt from "jsonwebtoken";
import User from "./models/User.js";
import { redisClient } from "./config/redis.js";

let io;

export const initSocket = async (server) => {
    const pubClient = redisClient;
    const subClient = pubClient.duplicate();

    await subClient.connect();

    const allowedOrigins = [
        process.env.CORS_ORIGIN,
        'http://localhost:5173',
        'http://localhost:4000',
        'http://localhost:5000',
        'https://djportal.vercel.app'
    ].filter(Boolean);

    io = new Server(server, {
        adapter: createAdapter(pubClient, subClient),
        cors: {
            origin: allowedOrigins,
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

export const getIO = () => {
    if (!io) {
        throw new Error("Socket.io not initialized!");
    }
    return io;
};

// Utility to emit to specific user
export const emitToUser = (userId, event, data) => {
    io.to(`user:${userId}`).emit(event, data);
};

// Utility to emit to class
export const emitToClass = (classId, event, data) => {
    io.to(`class:${classId}`).emit(event, data);
};

