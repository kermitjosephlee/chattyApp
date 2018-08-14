import React, { Component } from "react";

class Message extends Component {
  render() {
    let interimName = this.props.userName;
    let interimStyle = {};

    // filters if there is a valid userName, prints anon if none
    if (!this.props.userName) {
      interimName = "anonymous";
      interimStyle = { fontStyle: "italic" };
    }
    return (
      <div className="message">
        <span
          className="message-username"
          style={{
            color: this.props.userColor,
            backgroundColor: this.props.bgcolor
          }}
        >
          {interimName}
        </span>
        <span className="message-content" style={interimStyle}>
          {this.props.messageContent}
        </span>
      </div>
    );
  }
}

export default Message;
