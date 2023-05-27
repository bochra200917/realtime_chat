const express = require('express');
const app = express();
const http = require('http');
const stripe = require('./stripe_server');
const server = http.createServer(app);
const io = require('socket.io')(server,
    {
        cors: {
            origin: "http://localhost:4200",
            methods: ["GET", "POST"]
        }
    });
app.use(stripe);

// Handle Socket.IO connections
io.on('connection', (socket) => {
    console.log('A user connected to the server.');

    // Join a conversation
    socket.on('joinConversation', ({ conversationId }) => {
        console.log(`User joined the conversation: ${conversationId}`);
        socket.join(conversationId);
    });

    // Leave a conversation
    socket.on('leaveConversation', ({ conversationId }) => {
        console.log(`User left the conversation: ${conversationId}`);
        socket.leave(conversationId);
    });

    // Send a message to a conversation
    socket.on('sendMessage', ({ conversationId, message }) => {
        console.log(`User sent a message to the conversation: ${conversationId}`);
        io.to(conversationId).emit('messageReceived', { conversationId, message });
    });

    // Disconnect from the server
    socket.on('disconnect', () => {
        console.log('A user disconnected from the server.');
    });
});

// Start the server
const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Server listening on port ${port}.`);
});
