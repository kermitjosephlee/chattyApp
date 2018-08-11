// WEBSOCKET SERVER 3001

const express = require("express");
const WebSocket = require("ws");
const PORT = 3001;
const uuid = require("uuid/v4");
const tinycolor = require("tinycolor2");
const server = express()
  .use(express.static("public"))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

const wss = new WebSocket.Server({ server });

const textColorMaker = () => {
  let textColor = tinycolor.random().toHexString();
  return textColor;
};

const complementaryTextColorMaker = textColor => {
  let complementaryTextColor = tinycolor(textColor)
    .complement()
    .setAlpha(0.1)
    .toHex8String();
  return complementaryTextColor;
};

wss.broadcast = msg => {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
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

  let textColor = textColorMaker();
  let complementaryTextColor = complementaryTextColorMaker(textColor);

  const userColor = {
    type: "userColor",
    textcolor: textColor,
    backgroundcolor: complementaryTextColor
  };
  const userColorStr = JSON.stringify(userColor);
  ws.send(userColorStr);

  ws.on("message", message => {
    const msg = JSON.parse(message);
    msg.id = uuid();
    messageTypeFilter(msg);
    wss.broadcast(msg);
  });

  ws.on("close", () => {
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
      break;
    case "postNotification":
      msg.type = "incomingNotification";
      break;
    default:
      console.error("*** Unknown Server Side Event Type *** -- " + msg.type);
      throw new Error("Unknown server side event type: " + msg.type);
  }
};
