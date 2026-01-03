import React from 'react'
import { io } from 'socket.io-client';
import { Button, Container, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { useEffect } from 'react';

const App = () => {

  const socket = React.useMemo(() => io('http://localhost:3000'), []);

  const [message, setMessage] = useState('');
  const [room, setRoom] = useState('');
  const [socketId, setSocketId] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to server with ID:', socket.id);
      setSocketId(socket.id);
    });

    socket.on('welcome', (s) => {
      console.log(s);
    });

    socket.on('newUser', (s) => {
      console.log(s);
    });

    socket.on('recieveMesage', (data) => {
      console.log('Message from server:', data.message);
      setMessages((prevMessages) => [...prevMessages, data.message]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit('message', { message, room });
    setMessage('');
    e.target.reset();
  };

  return (
    <Container>
      <Typography variant="h4" component="h4" gutterBottom>
        Socket.io Client
      </Typography>

      <Typography variant="h6" component="h6" gutterBottom>
        Your Socket ID: {socketId}
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField value={message} onChange={e => setMessage(e.target.value)} id="outlined-basic" label="Message" variant='outlined' />

        <TextField value={room} onChange={e => setRoom(e.target.value)} id="outlined-basic" label="Room" variant='outlined' />
        <Button variant="contained" color="primary" type="submit"> Send Message</Button>
      </form>

      {
        messages.map((msg, index) => (
          <Typography key={index} variant="body1" component="p" gutterBottom>
            {msg}
          </Typography>
        ))
      }

    </Container >
  )
}

export default App