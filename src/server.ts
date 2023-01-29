import App from ".";

const app = new App().app;

import http from "http";

const server = http.createServer(app);

import { Server } from "socket.io";

const io = new Server(server);

io.on("connection", (socket) => {
  socket.on("message", (data) => {
    const { id, message } = data;
    socket.broadcast.emit("message", id, message);
  });
});

export default server;
