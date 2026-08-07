import { Server } from 'socket.io';
import { verifyToken } from '../utils/generateToken.js';
import User from '../models/User.js';
import { ENV } from '../config/env.js';

let io;

export const initSocket = (httpServer) => {
      console.log("✅ initSocket called");

  io = new Server(httpServer, {
    cors: {
      origin:      ENV.CLIENT_URL,
      methods:     ['GET', 'POST'],
      credentials: true,
    },
  });
    console.log("✅ initSocket created");

io.engine.on("connection_error", (err) => {
  console.log("========== ENGINE ERROR ==========");
  console.log("Code:", err.code);
  console.log("Message:", err.message);
  console.log("Context:", err.context);
});
  // ── Auth middleware ────────────────────────────────
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error('No token provided'));

      const decoded = verifyToken(token);
      const user    = await User.findById(decoded.id).select('name email');
      if (!user)    return next(new Error('User not found'));

      socket.user = user;
      next();
    
    } catch (error) {
      next(new Error('Authentication failed'));
    }
  });

  // ── Connection ─────────────────────────────────────
  io.on('connection', (socket) => {
    console.log(`🔌 ${socket.user.name} connected`);

    // Each user auto joins their personal room
    socket.join(`user:${socket.user._id}`);

    // Join workspace or project room
    socket.on('join:room', (room) => {
      socket.join(room);
      console.log(`${socket.user.name} joined ${room}`);
    });

    socket.on('leave:room', (room) => {
      socket.leave(room);
    });

    socket.on('disconnect', () => {
      console.log(`🔌 ${socket.user.name} disconnected`);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) throw new Error('Socket not initialized');
  return io;
};