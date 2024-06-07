const express = require('express');
const http = require('http');
const path = require('path');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(path.join(__dirname, 'public')));

let rooms = {};

io.on('connection', (socket) => {
    console.log('New user connected');

    socket.on('join', ({ room, mode }) => {
        socket.join(room);

        if (!rooms[room]) {
            rooms[room] = [];
        }

        rooms[room].push(socket.id);

        if (rooms[room].length > 1) {
            rooms[room].forEach(id => {
                if (id !== socket.id) {
                    io.to(id).emit('new user', socket.id);
                    io.to(socket.id).emit('new user', id);
                }
            });
        }

        socket.on('message', (message) => {
            const { to, data } = message;
            io.to(to).emit('message', { from: socket.id, data });
        });

        socket.on('disconnect', () => {
            rooms[room] = rooms[room].filter(id => id !== socket.id);
            rooms[room].forEach(id => {
                io.to(id).emit('user disconnected', socket.id);
            });
            if (rooms[room].length === 0) {
                delete rooms[room];
            }
        });
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
