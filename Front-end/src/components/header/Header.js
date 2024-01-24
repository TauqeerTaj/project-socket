import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import socketIo from "socket.io-client";
import "./style.css";

let socket;
const ENDPOINT = "http://localhost:8080";

const Header = ({ listHandler }) => {
  const { state } = useLocation();
  const navigate = useNavigate();
  socket = socketIo(ENDPOINT, { transports: ["websocket"] });

  const [countData, setCountData] = useState([]);
  const [sendMessage, setSendMessage] = useState([]);
  const [showNotification, setShowNotification] = useState(false);
  const [count, setCount] = useState(false);
  const [headerInfo] = useState(state?.user ?? state);

  const countHandler = () => {
    if (countData.length > 0) {
      listHandler(true);
      setSendMessage([...sendMessage, ...countData]);
      setShowNotification(!showNotification);
    }
    if (sendMessage.length > 0) {
      setShowNotification(!showNotification);
    }
    setCountData([]);
    setCount(false);
  };

  useEffect(() => {
    socket.on("sendMessage", (data) => {
      if (data.receiver_id === headerInfo?.id) {
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
          <FontAwesomeIcon icon={faBell} onClick={countHandler} />
          <span
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/");
              socket.emit("disconn");
              socket.off();
            }}
          >
            Logout
          </span>
          {showNotification && (
            <div className="notification">
              {sendMessage?.map((notifi) => (
                <div
                  className="content"
                  onClick={() => moveToDetailsPage(notifi)}
                >
                  <div>
                    <strong>Project:</strong>
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
