import { io } from 'socket.io-client';

const URL = 'https://mark.loay.work';

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
