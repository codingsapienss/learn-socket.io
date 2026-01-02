import React from 'react'
import { io } from 'socket.io-client';

const App = () => {
  const socket = io('http://localhost:3000');

  React.useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to server with ID:', socket.id);
    });

    socket.on('welcome', (s) => {
      console.log(s);
    });

    socket.on('newUser', (s) => {
      console.log(s);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    return () => {
      socket.disconnect();
    };
  }, [socket]);

  return (
    <div>App</div>
  )
}

export default App