import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { useSelector, useDispatch } from "react-redux";
import socketIo from "socket.io-client";
import { chatBoxHandler } from "../../store/reducers/chatReducer";
import { saveMessages, getMessages } from "../../api/messages";
import "./style.css";

let socket;
const ENDPOINT = "http://localhost:8080";

function Chat() {
  const [textMessage, setTextMessage] = useState("");
  const [chatBoxMsg, setChatBoxMsg] = useState([])
  const [getMsgs, setGetMsgs] = useState([])

  socket = socketIo(ENDPOINT, { transports: ["websocket"] });
  const globalState = useSelector((state) => state.chat);
  const dispatch = useDispatch();
  const headerData = JSON.parse(localStorage.getItem("headerData"));
  const bottomEl = useRef(null);

  useEffect(() => {
    async function fetchData() {
      let data = await getMessages();
      data.list.sort(function (a, b) { return a.date - b.date })
      const a = globalState.notifiMessage;
      const b = data.list
      const filterNotifiMsg = a.filter(function(obj) {
        return !b.some(function(obj2) {
            return +obj.date == +obj2.date;
        });
    });
      console.log("fitler:", filterNotifiMsg, 'dataList:', data.list)
      setChatBoxMsg([...chatBoxMsg, ...data.list, ...filterNotifiMsg])
      setGetMsgs([...data.list])

    }
    fetchData()
  }, [globalState])


  useEffect(() => {
    socket.on("sendMessage", (data) => {
      if (data.receiver_id === headerData?.id) {
        setChatBoxMsg([...chatBoxMsg, data]);
      }
    });
    scrollToBottom()
  }, [chatBoxMsg]);

  const scrollToBottom = () => {
    bottomEl?.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const changeHandler = (e) => {
    setTextMessage(e.target.value);
  };
  const submitHandler = (e) => {
    e.preventDefault();
    if (textMessage) {
      socket.emit("message", {
        message: {
          topic: textMessage,
          category: {
            name: headerData?.name,
            id: globalState.chatUserId,
            sender_id: headerData?.id
          },
          receiver_id: globalState.chatUserId,
          date: Date.now()
        },
        id: "dummy id",
      });
    }
    setChatBoxMsg([...chatBoxMsg, {
      text: textMessage,
      id: headerData.id,
      date: Date.now()
    }])
    setTextMessage("");
  };
  const closeChat = async () => {
    dispatch(chatBoxHandler(""))
    const filteredMsgs = []
    if (getMsgs.length) {
      const results = chatBoxMsg.filter(({ _id: id1 }) => !getMsgs.some(({ _id: id2 }) => id2 === id1));
      filteredMsgs.push(...results)
    } else {
      filteredMsgs.push(...chatBoxMsg)
    }
    await saveMessages(filteredMsgs)
  }
console.log("global:", globalState.notifiMessage)
  return (
    <div className="chat">
      <header>
        <h4>{globalState.chatUser}</h4>
        <FontAwesomeIcon
          icon={faClose}
          onClick={() => closeChat()}
        />
      </header>
      <div className="message-box">
        {chatBoxMsg?.map(msg => (<div className={(msg.receiver_id === headerData.id || msg.id !== headerData.id) ? 'rightMsg' : 'msg'}>
          <span key={msg.id}>{msg.text ?? msg.topic ?? msg.message}</span>
          <div ref={bottomEl}></div>
        </div>))}
      </div>
      <form onSubmit={submitHandler}>
        <input type="text" value={textMessage} onChange={changeHandler} />
        <FontAwesomeIcon icon={faPaperPlane} onClick={submitHandler} />
      </form>
    </div>
  );
}

export default Chat;
