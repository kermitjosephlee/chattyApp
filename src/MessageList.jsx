import React, { Component } from "react";
import Message from "./Message.jsx";

class MessageList extends Component {
  render() {
    const messageItems = this.props.messageArray.map(messageIndex => {
      return (
        <Message
          key={messageIndex.id}
          userName={messageIndex.username}
          messageContent={messageIndex.content}
        />
      );
    });
    return (
      <main className="messages">
        <div>{messageItems}</div>
      </main>
    );
  }
}

export default MessageList;
