import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { useSelector, useDispatch } from "react-redux";
import { chatBoxHandler } from "../../store/reducers/chatReducer";
import "./style.css";

function Chat() {
  const [textMessage, setTextMessage] = useState("");

  const state = useSelector((state) => state.chat);
  const dispatch = useDispatch();

  const changeHandler = (e) => {
    setTextMessage(e.target.value);
  };
  const submitHandler = (e) => {
    e.preventDefault();
  };

  return (
    <div className="chat">
      <header>
        <h4>{state.chatUser}</h4>
        <FontAwesomeIcon
          icon={faClose}
          onClick={() => dispatch(chatBoxHandler(""))}
        />
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
