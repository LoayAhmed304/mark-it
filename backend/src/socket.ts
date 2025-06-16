import { Server as SocketIOServer } from 'socket.io';
import { UserDocument } from './models/user.model.js';
import http from 'http';
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
// create one HTTP server for the express app and the socket.io server
const serverHttp = http.createServer(app);

const io = new SocketIOServer(serverHttp, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
  },
});

const docUsers: Record<string, Map<string, UserDocument>> = {};

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // when a user connects to a document: send the joined user, and the list of users in that document
  socket.on(
    'join-doc',
    ({ docId, user }: { docId: string; user: UserDocument }) => {
      socket.join(docId);
      socket.data.user = user;
      socket.data.docId = docId;

      console.log(
        `Client ${socket.id}, with username ${user.username} joined document: ${docId}`,
      );
      if (!docUsers[docId]) {
        docUsers[docId] = new Map<string, UserDocument>();
      }
      docUsers[docId].set(user._id.toString(), user);

      socket.to(docId).emit('joined-doc', {
        user,
        docId,
      });
      const users = docUsers[docId] ? Array.from(docUsers[docId].values()) : [];
      io.to(docId).emit('doc-users', users);
    },
  );

  // when a user sends an update to a document: send the doc id & the document content to all users in that document
  socket.on(
    'update-doc',
    ({ docId, content }: { docId: string; content: string }) => {
      console.log(`Document ${docId} updated with content: ${content}`);

      io.to(docId).emit('doc-updated', {
        docId,
        content,
      });
    },
  );

  // when a user leaves a document: send the left user, and the list of users in that document
  socket.on(
    'leave-doc',
    ({ docId, user }: { docId: string; user: UserDocument }) => {
      console.log(
        `Client ${socket.id} with username ${user.username} left document: ${docId}`,
      );

      socket.leave(docId);
      if (docUsers[docId]) {
        docUsers[docId].delete(user._id.toString());
        if (docUsers[docId].size === 0) {
          delete docUsers[docId];
        }
      }

      socket.to(docId).emit('left-doc', {
        user,
        docId,
      });
      const users = docUsers[docId] ? Array.from(docUsers[docId].values()) : [];
      socket.to(docId).emit('doc-users', users);
    },
  );

  // when a user disconnects non-voluntarily: send the left user, and the list of users in that document
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    const userId = socket.data.user?._id.toString();
    const docId = socket.data.docId;
    if (!userId || !docId) {
      console.error('User ID or Document ID not found on disconnect');
      return;
    }
    socket.to(socket.data.docId).emit('user-disconnected', {
      user: socket.data.user,
    });

    if (docUsers[socket.data.docId]) {
      docUsers[socket.data.docId].delete(socket.data.user._id.toString());
      if (docUsers[socket.data.docId].size === 0) {
        delete docUsers[socket.data.docId];
      }
    }

    const users = docUsers[docId] ? Array.from(docUsers[docId].values()) : [];
    socket.to(socket.data.docId).emit('doc-users', users);
  });

  // when a session is terminated: just emit an empty event to the clients
  socket.on('terminate-session', ({ docId }: { docId: string }) => {
    socket.to(docId).emit('session-terminated');
  });
});

export { app, serverHttp, io };
