import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { useSelector, useDispatch } from "react-redux";
import socketIo from "socket.io-client";
import { chatBoxHandler } from "../../store/reducers/chatReducer";
import "./style.css";

let socket;
const ENDPOINT = "http://localhost:8080";

function Chat() {
  const [textMessage, setTextMessage] = useState("");

  socket = socketIo(ENDPOINT, { transports: ["websocket"] });
  const globalState = useSelector((state) => state.chat);
  const dispatch = useDispatch();
  const data = JSON.parse(localStorage.getItem("headerData"));

  const changeHandler = (e) => {
    setTextMessage(e.target.value);
  };
  const submitHandler = (e) => {
    e.preventDefault();
    if (textMessage) {
      socket.emit("message", {
        message: {
          category: {
            name: data?.name,
            id: globalState.chatUserId,
          },
          receiver_id: globalState.chatUserId,
        },
        id: "dummy id",
      });
    }
    setTextMessage("");
  };

  return (
    <div className="chat">
      <header>
        <h4>{globalState.chatUser}</h4>
        <FontAwesomeIcon
          icon={faClose}
          onClick={() => dispatch(chatBoxHandler(""))}
        />
      </header>
      <div className="message-box"></div>
      <form onSubmit={submitHandler}>
        <input type="text" value={textMessage} onChange={changeHandler} />
        <FontAwesomeIcon icon={faPaperPlane} onClick={submitHandler} />
      </form>
    </div>
  );
}

export default Chat;
