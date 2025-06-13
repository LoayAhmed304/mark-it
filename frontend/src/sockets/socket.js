import { io } from 'socket.io-client';

const URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

export const socket = io(URL, {
  autoConnect: false,
});

export const connectSocket = () => {
  if (!socket.connected) {
    socket.connect();
  }
};

export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};

export const joinDocument = (docId, user) => {
  socket.emit('join-doc', {
    docId,
    user,
  });
};
