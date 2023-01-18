import App from ".";

const app = new App().app;

import http from "http";

const server = http.createServer(app);

import { Server } from "socket.io";

const io = new Server(server);

export default server;
