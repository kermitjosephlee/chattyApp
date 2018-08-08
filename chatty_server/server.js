// WEBSOCKET SERVER 3001

const express = require("express");
const SocketServer = require("ws").Server;
const PORT = 3001;
const server = express()
  .use(express.static("public"))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

const wss = new SocketServer({ server });

wss.on("connection", ws => {
  console.log("Client connected");
  ws.on("message", message => {
    console.log("Incoming Message: ", message);
  });

  ws.on("close", () => console.log("Client disconnected"));
});
