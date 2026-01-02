import React from 'react'
import { io } from 'socket.io-client';
import { Button, Container, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { useEffect } from 'react';

const App = () => {

  const socket = React.useMemo(() => io('http://localhost:3000'), []);

  const [message, setMessage] = useState('');

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to server with ID:', socket.id);
    });

    socket.on('welcome', (s) => {
      console.log(s);
    });

    socket.on('newUser', (s) => {
      console.log(s);
    });

    socket.on('recieveMesage', (data) => {
      console.log('Message from server:', data);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit('message', message);
    setMessage('');
    e.target.reset();
  };

  return (
    <Container>
      <Typography variant="h4" component="h4" gutterBottom>
        Socket.io Client
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField onChange={e => setMessage(e.target.value)} id="outlined-basic" label="Outlined" variant='outlined' />
        <Button variant="contained" color="primary" type="submit"> Send Message</Button>
      </form>

    </Container >
  )
}

export default App