import React, { Component } from "react";

class Message extends Component {
  render() {
    let interimName = this.props.userName;
    let interimStyle = {};

    if (!this.props.userName) {
      interimName = "*** Notification ***";
      interimStyle = { fontStyle: "italic" };
    }
    return (
      <div className="message">
        <span className="message-username">{interimName}</span>
        <span className="message-content" style={interimStyle}>
          {this.props.messageContent}
        </span>
      </div>
    );
  }
}

export default Message;
