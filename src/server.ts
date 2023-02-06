import App from ".";

const app = new App().app;

import http from "http";

import { Server } from "socket.io";

class Http {
  private server: http.Server;
  private io: Server;

  constructor() {
    this.server = http.createServer(app);
    this.io = new Server(this.server);
  }

  public async runApp(port: number | string): Promise<void> {
    this.io.on("connection", (socket) => {
      socket.on("message", (data) => {
        const { id, message } = data;
        socket.broadcast.emit("message", id, message);
      });
    });
    this.server.listen(port, () =>
      console.log(`app listening on port ${port}`)
    );
  }
}

export default new Http();
