import React, { Component } from "react";
import ChatBar from "./ChatBar.jsx";
import MessageList from "./MessageList.jsx";
// import colours from "./colours.jsx";

const socketServer = "ws://localhost:3001";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clientSize: 0,
      userColor: "black",
      currentUser: { name: "Joe" }, // optional. if currentUser is not defined, it means the user is Anonymous
      messages: [
        {
          type: "incomingMessage",
          content:
            "I won't be impressed with technology until I can download food.",
          username: "Anonymous1",
          bgcolor: "honeydew"
        },
        {
          type: "incomingNotification",
          content: "Anonymous1 changed their name to nomnom"
        },
        {
          type: "incomingMessage",
          content:
            "I wouldn't want to download Kraft Dinner. I'd be scared of cheese packet loss.",
          username: "Anonymous2",
          bgcolor: "honeydew"
        },
        {
          type: "incomingMessage",
          content: "...",
          username: "nomnom",
          bgcolor: "honeydew"
        },
        {
          type: "incomingMessage",
          content:
            "I'd love to download a fried egg, but I'm afraid encryption would scramble it",
          username: "Anonymous2",
          bgcolor: "honeydew"
        },
        {
          type: "incomingMessage",
          content: "This isn't funny. You're not funny",
          username: "nomnom",
          bgcolor: "honeydew"
        },
        {
          type: "incomingNotification",
          content: "Anonymous2 changed their name to NotFunny"
        }
      ]
    };
  }

  componentDidMount() {
    console.log("componentDidMount <App />");
    setTimeout(() => {
      console.log("Simulating incoming message");
      const newMessage = {
        username: "Michelle",
        content: "OOO EEE! CAN DO!!!"
      };
      const messages = this.state.messages.concat(newMessage);
      this.setState({ messages: messages });
    }, 3000);

    this.socket = new WebSocket(socketServer);
    this.socket.onmessage = event => {
      const parsedJSON = JSON.parse(event.data);
      const messages = this.state.messages.concat(parsedJSON);

      switch (parsedJSON.type) {
        case "incomingMessage":
          this.setState({ messages });
          break;
        case "incomingNotification":
          this.setState({ messages });
          break;
        case "clientSize":
          this.setState({ clientSize: parsedJSON.clientSize });
          break;
        case "userColor":
          this.setState({ userColor: parsedJSON.textcolor });
          this.setState({ bgcolor: parsedJSON.backgroundcolor });
          break;

        default:
          // console.error("*** Unknown Event Type *** -- " + parsedJSON.type);
          throw new Error("Unknown event type: " + parsedJSON.type);
      }
    };
  }
  //
  addMessage = content => {
    const newMessage = {
      type: "incomingMessage",
      username: this.state.currentUser.name,
      content: content,
      userColor: this.state.userColor,
      bgcolor: this.state.bgcolor
    };
    console.log("new message: ", JSON.stringify(newMessage));
    this.socket.send(JSON.stringify(newMessage));
  };

  changeUserName = username => {
    const insertedContent =
      this.state.currentUser.name + " has changed their name to " + username;
    const newNameChange = {
      type: "postNotification",
      content: insertedContent
    };
    this.socket.send(JSON.stringify(newNameChange));
    this.setState({ currentUser: { name: username } });
  };

  render() {
    return (
      <div>
        <nav className="navbar">
          <a href="/" className="navbar-brand">
            ChattyCathy
          </a>
          <span className="user-numbers">{this.state.clientSize} users</span>
        </nav>
        <ChatBar
          currentUser={this.state.currentUser.name}
          addMessage={this.addMessage}
          changeUserName={this.changeUserName}
        />
        <MessageList messageArray={this.state.messages} />
      </div>
    );
  }
}
export default App;
