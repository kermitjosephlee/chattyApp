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

// broadcasts stringified JSON packages to all users
wss.broadcast = msg => {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      const msgStr = JSON.stringify(msg);
      client.send(msgStr);
    }
  });
};

wss.on("connection", ws => {
  // broadcasts current number of clients to all users
  const clientSize = {
    type: "clientSize",
    clientSize: wss.clients.size
  };
  wss.broadcast(clientSize);

  // creates color pair for each new connection
  let textColor = textColorMaker();
  let complementaryTextColor = complementaryTextColorMaker(textColor);

  // sends color pair information to all users
  const userColor = {
    type: "userColor",
    textcolor: textColor,
    backgroundcolor: complementaryTextColor
  };
  const userColorStr = JSON.stringify(userColor);
  ws.send(userColorStr);

  // sends new messages with unique id to all users
  ws.on("message", message => {
    const msg = JSON.parse(message);
    msg.id = uuid();
    messageTypeFilter(msg);
    wss.broadcast(msg);
  });

  // updates number of clients connected on closed connections
  ws.on("close", () => {
    const clientSize = {
      type: "clientSize",
      clientSize: wss.clients.size
    };
    wss.broadcast(clientSize);
  });
});

// **********************************************************

// changes postNotifications from one user to an incomingNotification for broadcasting
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

// creates a random color using tinycolor for userName text color
const textColorMaker = () => {
  let textColor = tinycolor.random().toHexString();
  return textColor;
};

// takes textColor and returns a muted complementary color for the background of userName
const complementaryTextColorMaker = textColor => {
  let complementaryTextColor = tinycolor(textColor)
    .complement()
    .setAlpha(0.1)
    .toHex8String();
  return complementaryTextColor;
};
