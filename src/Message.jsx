import React, { Component } from "react";

class Message extends Component {
  render() {
    let interimName = this.props.userName;
    let interimStyle = {};
    console.log(this.props);

    if (!this.props.userName) {
      interimName = "*** Notification ***";
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
