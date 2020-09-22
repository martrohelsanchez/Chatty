import http from 'http';
import socketIo from 'socket.io';

let io: socketIo.Server;

export function connect(server: http.Server) {
    io  = socketIo(server, {
      pingTimeout: 30000,
    });

    io.on('connect', socket => {
        socket.on('join room', (roomName) => {
            socket.join(roomName);
        });

        socket.on('leave room', (roomName) => {
            socket.leave(roomName);
        });

        socket.on('startTyping', (convId, username) => {
            socket.to(convId).emit('startTyping', convId, username);
        })

        socket.on('stopTyping', (convId, username) => {
            socket.to(convId).emit('stopTyping', convId, username);
        })

        socket.on('err', err => {
            console.error(err)
        })
    })
}

export function getIo() {
    return io;
}