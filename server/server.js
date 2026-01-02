import express from 'express';
import { Server } from "socket.io";
import { createServer } from 'http';
import cors from 'cors';

const app = express();
const server = new createServer(app)
const PORT = 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
}));


const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true
    }
})

io.on('connection', (socket) => {
    console.log("User.id", socket.id);
    console.log('User connected...');

    socket.emit('welcome', `Welcome to the Socket.io server! ${socket.id}`);

    socket.broadcast.emit('newUser', `New user connected: ${socket.id}`);

    socket.on('disconnect', () => {
        console.log('User disconnected...');
    });
});

app.get('/', (req, res) => {
    res.send('Hello World!');
});

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});