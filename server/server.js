import express from 'express';
import { Server } from "socket.io";
import { createServer } from 'http';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';

const app = express();
const server = new createServer(app)
const PORT = 3000;

const secretKey = "your_secret_key";

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


app.get('/', (req, res) => {
    res.send('Hello World!');
});


app.get('/login', (req, res) => {
    const token = jwt.sign({ _id: "userId" }, secretKey, { expiresIn: '1h' });
    res.cookie('token', token).send({ message: 'Logged in successfully', token });
});


io.use((socket, next) => {
    cookieParser()(socket.request, socket.request.res, (err) => {
        if (err) return next(err);
        const token = socket.request.cookies.token;
        if (!token) {
            return next(new Error('Authentication error'));
        }
        const decoded = jwt.verify(token, secretKey);
        if (!decoded) {
            return next(new Error('Authentication error'));
        }
        next()
    });
})

io.on('connection', (socket) => {
    console.log("User.id", socket.id);
    console.log('User connected...');

    socket.emit('welcome', `Welcome to the Socket.io server! ${socket.id}`);

    socket.broadcast.emit('newUser', `New user connected: ${socket.id}`);

    socket.on("message", (data) => {
        console.log("Message from client:", data.message);
        // io.emit("recieveMesage", data);
        // socket.broadcast.emit("recieveMesage", data);

        if (data.room) {
            socket.to(data.room).emit("recieveMesage", data);
            // io.to(data.room).emit("recieveMesage", data);
        } else {
            socket.broadcast.emit("recieveMesage", data);
        }
    });

    socket.on("joinRoom", (roomName) => {
        socket.join(roomName);
        console.log(`Socket ${socket.id} joined room: ${roomName}`);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected...');
    });
});


server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});