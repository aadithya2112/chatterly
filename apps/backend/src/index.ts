import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { initializeSocket } from "./socket";

const app = express();
const server = createServer(app);

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
  transports: ["websocket"],
  allowEIO3: true,
});

// Port configuration
const PORT = process.env.PORT || 4000;

// Use the modularized socket logic
initializeSocket(io);

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
