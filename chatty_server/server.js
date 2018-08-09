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
  console.log("broadcast msg:", msg);
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      console.log("Socket Side:", msg);
      const msgStr = JSON.stringify(msg);
      client.send(msgStr);
    }
  });
};

wss.on("connection", ws => {
  const clientSize = {
    type: "clientSize",
    clientSize: wss.clients.size
  };
  wss.broadcast(clientSize);
  console.log("On Connection - userName:", clientSize);
  ws.on("message", message => {
    const msg = JSON.parse(message);
    msg.id = uuid();
    messageTypeFilter(msg);
    console.log("Post Parsing: ", msg);
    wss.broadcast(msg);
  });

  ws.on("close", () => {
    console.log("Client disconnected");
    const clientSize = {
      type: "clientSize",
      clientSize: wss.clients.size
    };
    wss.broadcast(clientSize);
  });
});

// **********************************************************

const messageTypeFilter = msg => {
  switch (msg.type) {
    case "incomingMessage":
      console.log("APP/incomingMessage: " + msg.content);
      break;
    case "postNotification":
      console.log("APP/incomingNotification: " + msg.content);
      msg.type = "incomingNotification";
      break;
    default:
      console.error("*** Unknown Server Side Event Type *** -- " + msg.type);
      throw new Error("Unknown server side event type: " + msg.type);
  }
};
