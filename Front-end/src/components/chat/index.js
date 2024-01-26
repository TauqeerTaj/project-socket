import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import "./style.css";

function Chat({ name, closeChat }) {
  return (
    <div className="chat">
      <header>
        <h4>{name}</h4>
        <FontAwesomeIcon icon={faClose} onClick={() => closeChat("")} />
      </header>
      <div className="message-box"></div>
      <input type="text" />
    </div>
  );
}

export default Chat;
