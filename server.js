const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mysql = require('mysql');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '@Andries94',
    database: 'status_app'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL');
});

io.on('connection', (socket) => {
    console.log('New user connected');

    // Send existing statuses to the new user
    db.query('SELECT * FROM statuses ORDER BY timestamp DESC', (err, results) => {
        if (err) throw err;
        socket.emit('load statuses', results);
    });

    // Listen for new statuses
    socket.on('new status', (data) => {
        const query = 'INSERT INTO statuses (user, status) VALUES (?, ?)';
        db.query(query, [data.user, data.status], (err) => {
            if (err) throw err;
            io.emit('update statuses', data);
        });
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

server.listen(3000, () => {
    console.log('Server is running on http://localhost:3306');
});
