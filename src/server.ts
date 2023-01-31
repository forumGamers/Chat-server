import App from ".";

const app = new App().app;

import http from "http";

import { Server } from "socket.io";

class Http {
  public server: http.Server;
  public io: Server;

  constructor() {
    this.server = http.createServer(app);
    this.io = new Server(this.server);
    this.socket();
  }

  private socket(): void {
    this.io.on("connection", (socket) => {
      socket.on("message", (data) => {
        const { id, message } = data;
        socket.broadcast.emit("message", id, message);
      });
    });
  }
}

export default new Http().server;
