import express from 'express';
import { json } from 'body-parser';
import cors from 'cors';
import { createServer } from 'http';
import { Server as IOServer, Socket } from 'socket.io';

import competitionRoute from './routes/competition.route';
import uploadRoute from './routes/upload.route';
import applicationRoute from './routes/application.route';

const PORT = process.env.PORT ?? 3000;
const app = express();

// Middleware
app.use(json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

// API routes
app.use('/api/competition', competitionRoute);
app.use('/api/application', applicationRoute);
app.use('/api/upload', uploadRoute);

// Create HTTP server & attach Socket.IO
const httpServer = createServer(app);
const io = new IOServer(httpServer, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
});

/**
 * Register multiple event handlers on a socket
 */
function registerHandlers(
  socket: Socket,
  handlers: Record<string, (data: any) => void>
) {
  for (const [event, handler] of Object.entries(handlers)) {
    socket.on(event, handler);
  }

  socket.on('disconnect', () => {
    console.log(`🔴 [${socket.nsp.name}] disconnected: ${socket.id}`);
  });
}

// Default namespace
io.on('connection', (socket) => {
  console.log(`🟢 [${socket.nsp.name}] connected: ${socket.id}`);

  registerHandlers(socket, {
    joinRoom: (roomId: string) => {
      socket.join(roomId);
      console.log(`📥 [${socket.nsp.name}] joinRoom: ${roomId}`);
    },
    'start judge': (data) => {
      console.log(`➡️ [${socket.nsp.name}] start judge`, data);
      socket.broadcast.emit('start judge', data);
    }
  });
});

// /display namespace
const displayEvents = [
  'timer-start',
  'final-result',
  'reset-timer',
  'show-round-tv',
  'show-final',
  'end-timer',
  'display athlete',
  'start judge',
  'judge scores',
  'result',
  'end of pool'
];

const displayNsp = io.of('/display');
displayNsp.on('connection', (socket) => {
  console.log(`🟢 [${socket.nsp.name}] connected: ${socket.id}`);

  const handlers: Record<string, (data: any) => void> = {};

  // Generic re-broadcast
  displayEvents.forEach((evt) => {
    handlers[evt] = (data) => {
      console.log(`🔄 [${socket.nsp.name}] ${evt}`, data);
      socket.broadcast.emit(evt, data);
    };
  });

  // Special case: show pool → active pool
  handlers['show pool'] = (data) => {
    console.log(`🔄 [${socket.nsp.name}] show pool`, data);
    socket.broadcast.emit('active pool', data.pool);
  };

  registerHandlers(socket, handlers);
});

// /judge namespace
const judgeNsp = io.of('/judge');
judgeNsp.on('connection', (socket) => {
  console.log(`🟢 [${socket.nsp.name}] connected: ${socket.id}`);

  // Add judge-specific handlers here

  socket.on('disconnect', () => {
    console.log(`🔴 [${socket.nsp.name}] disconnected: ${socket.id}`);
  });
});

// Expose io to routes
app.set('io', io);

// Start server
httpServer.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});
