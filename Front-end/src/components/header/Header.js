import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import socketIo from "socket.io-client";
import { chatBoxHandler, notifiChatHandler } from "../../store/reducers/chatReducer";
import "./style.css";

let socket;
const BASE_URL = process.env.REACT_APP_BASE_URL
const ENDPOINT = BASE_URL;

const Header = ({ listHandler }) => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch()
  socket = socketIo(ENDPOINT, { transports: ["websocket"] });

  const [countData, setCountData] = useState([]);
  const [sendMessage, setSendMessage] = useState([]);
  const [showNotification, setShowNotification] = useState(false);
  const [count, setCount] = useState(false);
  const [headerInfo, setHeaderInfo] = useState(null);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("headerData"));
    if (data) {
      setHeaderInfo(data);
    }
  }, []);

  const countHandler = () => {
    if (countData.length > 0) {
      listHandler(true);
      setSendMessage([...sendMessage, ...countData]);
      setShowNotification(!showNotification);
    }
    if (sendMessage?.length > 0) {
      setShowNotification(!showNotification);
    }
    setCountData([]);
    setCount(false);
  };

  useEffect(() => {
    socket.on("sendMessage", (data) => {
      if (data.receiver_id === state?.id ?? headerInfo?.id) {
        setCountData([...countData, data]);
        setCount(true);
      }
    });
  }, [countData]);

  const moveToDetailsPage = (details) => {
    setShowNotification(!showNotification);
    navigate("/project-details", {
      state: {
        ...details,
        user: state?.user,
      },
    });
  };

  const notifiMsgHandler = () => {
    const filteredNotifiMsgs = sendMessage.filter(item => !item.description)
    dispatch(notifiChatHandler(filteredNotifiMsgs))
  }

  return (
    <div>
      <header>
        <div>
          <img src={headerInfo?.profile} className="profile" alt="profile" />
          <h2>{headerInfo?.name}</h2>
        </div>
        <div>
          <h3>{headerInfo?.category}</h3>
        </div>
        <div className="logout">
          {countData.length > 0 && count && (
            <count onClick={countHandler}>{countData.length}</count>
          )}
          <FontAwesomeIcon icon={faBell} onClick={() => countHandler()} />
          <span
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("headerData");
              navigate("/");
              socket.emit("disconn");
              socket.off();
              dispatch(chatBoxHandler(""))
            }}
          >
            Logout
          </span>
          {showNotification && (
            <div className="notification">
              {sendMessage?.map((notifi) => (
                <div
                  className="content"
                  onClick={() => {
                    notifi.description ? moveToDetailsPage(notifi) : dispatch(chatBoxHandler({
                      name: notifi.category.name,
                      id: notifi.category.sender_id}))
                      notifiMsgHandler()
                      setShowNotification(!showNotification)
                  }
                  }
                >
                  <div>
                    <strong>{notifi.description? 'Project:' : 'Message:'}</strong>
                    <span>{notifi.topic}</span>
                  </div>
                  <div>
                    <strong>Sender:</strong>
                    <span>{notifi.category.name}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </header>
    </div>
  );
};
export default Header;
