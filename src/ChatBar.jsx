import React, { Component } from "react";

class ChatBar extends Component {
  onSubmit = evt => {
    if (evt.key === "Enter") {
      const messageInput = evt.target.value;
      this.props.addMessage(messageInput);
      evt.target.value = "";
    }
  };

  onSubmitName = evt => {
    if (evt.key === "Enter") {
      const userName = evt.target.value;
      // console.log("USERNAME: ", userName);
      this.props.changeUserName(userName);
    }
  };

  render() {
    return (
      <footer className="chatbar">
        <input
          name="userName"
          className="chatbar-username"
          placeholder="Your Name (Optional)"
          defaultValue={this.props.currentUser}
          onKeyPress={this.onSubmitName}
        />
        <input
          name="messageInput"
          className="chatbar-message"
          placeholder="Type a message and hit ENTER"
          onKeyPress={this.onSubmit}
        />
      </footer>
    );
  }
}
export default ChatBar;
