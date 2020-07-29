const express = require('express');
const socketio =  require('socket.io')
const http = require('http')

const PORT = process.env.PORT || 5000

const router = require('./router')

const app = express();
const server = http.createServer(app); //
const io = socketio(server); //instance of socketio

io.on('connection', (socket)=>{ //gets a socket as parameter that is going to be a client side socket
    console.log('New connection')
    
    socket.on('disconnect', ()=>{
        console.log('User left')
    })
});

app.use(router)

server.listen(PORT, (req,res)=>{
    console.log(`Listening on http://localhost:${PORT}`)
})