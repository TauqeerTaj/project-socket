import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import "./style.css";

function Chat({ name, closeChat }) {
  const [textMessage, setTextMessage] = useState("");

  const changeHandler = (e) => {
    setTextMessage(e.target.value);
  };
  const submitHandler = (e) => {
    e.preventDefault();
  };

  return (
    <div className="chat">
      <header>
        <h4>{name}</h4>
        <FontAwesomeIcon icon={faClose} onClick={() => closeChat("")} />
      </header>
      <div className="message-box"></div>
      <form onSubmit={submitHandler}>
        <input type="text" value={textMessage} onChange={changeHandler} />
        <FontAwesomeIcon icon={faPaperPlane} onClick={() => submitHandler} />
      </form>
    </div>
  );
}

export default Chat;
