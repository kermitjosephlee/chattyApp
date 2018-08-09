import React, { Component } from "react";
import ChatBar from "./ChatBar.jsx";
import MessageList from "./MessageList.jsx";

const socketServer = "ws://localhost:3001";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: { name: "Joe" }, // optional. if currentUser is not defined, it means the user is Anonymous
      messages: [
        {
          type: "incomingMessage",
          content:
            "I won't be impressed with technology until I can download food.",
          username: "Anonymous1"
        },
        {
          type: "incomingNotification",
          content: "Anonymous1 changed their name to nomnom"
        },
        {
          type: "incomingMessage",
          content:
            "I wouldn't want to download Kraft Dinner. I'd be scared of cheese packet loss.",
          username: "Anonymous2"
        },
        {
          type: "incomingMessage",
          content: "...",
          username: "nomnom"
        },
        {
          type: "incomingMessage",
          content:
            "I'd love to download a fried egg, but I'm afraid encryption would scramble it",
          username: "Anonymous2"
        },
        {
          type: "incomingMessage",
          content: "This isn't funny. You're not funny",
          username: "nomnom"
        },
        {
          type: "incomingNotification",
          content: "Anonymous2 changed their name to NotFunny"
        }
      ]
    };
  }
  /* where you would put in your data calls aka. AJAX or API... */
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
      console.log("This is coming from APP: ", parsedJSON.content);
      const messages = this.state.messages.concat(parsedJSON);
      this.setState({ messages });
    };
  }
  //
  addMessage = content => {
    const newMessage = {
      username: this.state.currentUser.name,
      content: content
    };
    this.socket.send(JSON.stringify(newMessage));
  };

  changeUserName = username => {
    this.setState({ currentUser: { name: username } });
  };

  render() {
    return (
      <div>
        <nav className="navbar">
          <a href="/" className="navbar-brand">
            Chatty
          </a>
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
