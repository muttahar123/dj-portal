import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import User from "./models/User.js";

let io;

export const initSocket = (server) => {
    const allowedOrigins = [
        process.env.CORS_ORIGIN,
        'http://localhost:5173',
        'http://localhost:4000',
        'http://localhost:5000',
        'https://djportal.vercel.app'
    ].filter(Boolean);

    io = new Server(server, {
        cors: {
            origin: allowedOrigins,
            methods: ["GET", "POST"],
            credentials: true
        }
    });

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

        socket.join(`user:${socket.user._id}`);

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

export const emitToUser = (userId, event, data) => {
    io.to(`user:${userId}`).emit(event, data);
};

export const emitToClass = (classId, event, data) => {
    io.to(`class:${classId}`).emit(event, data);
};
