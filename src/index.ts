import express from 'express';
import { json } from 'body-parser';
import cors from 'cors';
import { createServer } from 'http';
import { Server as IOServer } from 'socket.io';

import competitionRoute from './routes/competition.route';
import uploadRoute from './routes/upload.route';
import applicationRoute from './routes/application.route';

const app = express();

app.use(json());
app.use(cors());
app.use("/uploads", express.static("uploads"));

// --- create HTTP server & attach Socket.IO ---
const httpServer = createServer(app);
const io = new IOServer(httpServer, {
  cors: {
    origin: "*",        // adjust to your client origin in prod
    methods: ["GET","POST"]
  }
});

// --- socket handlers ---
io.on("connection", (socket) => {
  console.log(`🟢 Socket connected: ${socket.id}`);

  // example custom event
  socket.on("joinRoom", (roomId: string) => {
    socket.join(roomId);
    console.log(`Socket ${socket.id} joined room ${roomId}`);
  });

  socket.on('start judge', (data) => {
		socket.broadcast.emit('start judge', data);
	})

  socket.on("disconnect", () => {
    console.log(`🔴 Socket disconnected: ${socket.id}`);
  });
});

// --- make io available in routes ---
app.set("io", io);

// --- your API routes can now access io via req.app.get("io") ---
app.use("/api/competition", competitionRoute);
app.use("/api/application", applicationRoute);
app.use('/api/upload', uploadRoute);

// --- start server ---
const PORT = process.env.PORT ?? 3000;
httpServer.listen(PORT, () => {
  console.log(`Server + Socket.IO listening on port ${PORT}`);
});
