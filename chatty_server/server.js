// WEBSOCKET SERVER 3001

const express = require("express");
const WebSocket = require("ws");
const PORT = 3001;
const uuid = require("uuid/v4");
const server = express()
  .use(express.static("public"))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

const wss = new WebSocket.Server({ server });

wss.broadcast = msg => {
  console.log("broadcase msg:", msg);
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      console.log("Socket Side:", msg);
      const msgStr = JSON.stringify(msg);
      client.send(msgStr);
    }
  });
};

// const addMessage = message => ({
//   id: uuid(),
//   username: "BOB",
//   content: message
// });

wss.on("connection", ws => {
  console.log("Client connected");
  ws.on("message", message => {
    const msg = JSON.parse(message);
    msg.id = uuid();
    console.log("Post Parsing: ", msg);
    wss.broadcast(msg);
  });

  ws.on("close", () => console.log("Client disconnected"));
});
