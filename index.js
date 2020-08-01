const express = require('express');
const socketio =  require('socket.io')
const http = require('http')

const {addUser, removeUser, getUser, getUsersInRoom} = require('./users')


const PORT = process.env.PORT || 5000

const router = require('./router')

const app = express();
const server = http.createServer(app); //
const io = socketio(server); //instance of socketio

io.on('connection', (socket)=>{ //gets a socket as parameter that is going to be a client side socket

    socket.on('join', ({name, room}, callback)=>{
        const {error,user } = addUser({id: socket.id, name,room});
       
        if(error){
            return callback(error)
        }

        //admin generated messages
        socket.emit('message', { text: `${user.name}, welcome to the room ${user.room}`}) //telling the user that has joined the chat
        socket.broadcast.to(user.room).emit('message', { text:`${user.name} has joined`}) // telling everyone(except the user) that the user has joined

        socket.join(user.room)

        callback()

    });

    //user generated messages
    socket.on('sendMessage', (message,callback)=>{
        const user = getUser(socket.id) //getting the user that sent the message(specific client instance)


        io.to(user.room).emit('message', { user: user.name, text: message})

        callback(); //This function is called for every chunk of incoming data. Two arguments are passed to it: the number of bytes written to buffer and a reference to buffer. Return false from this function to implicitly pause() the socket. always call the callback function so we can actually do something after the message is sent on the front end

    })

    
    socket.on('disconnect', ()=>{
        console.log('User left')
    })
});

app.use(router)

server.listen(PORT, (req,res)=>{
    console.log(`Listening on http://localhost:${PORT}`)
})