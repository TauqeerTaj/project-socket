import React, { useEffect, useState } from "react";
import { useLocation, Navigate } from "react-router-dom";
import socketIo from "socket.io-client";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCommentDots } from "@fortawesome/free-solid-svg-icons";
import "./dashboard.css";
import Chat from "../chat";

let socket;
const ENDPOINT = "http://localhost:8080";

function Dashboard() {
  const { state } = useLocation();
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([]);
  const [socketId, setSocketId] = useState("");
  const [projectList, setProjectList] = useState([]);
  const [validation, setValidation] = useState(false);
  const [selectedMember, setSelectedMember] = useState("");
  const [project, setProject] = useState({
    topic: "",
    category: {
      id: "",
      name: "",
    },
    searchCategory: "",
    description: "",
    file: "",
  });

  const [category] = useState(
    state?.category === "Supervisor" ? "student" : "supervisor"
  );
  const [selectedChat, setSelectedChat] = useState("");

  // const getProjects = () => {
  //   axios
  //     .get(`http://localhost:8080/project/projects?id=${state?.id}`)
  //     .then((res) => {
  //       setLoading(false);
  //       setProjectList([...res.data.list]);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // };
  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:8080/auth/${category}s`)
      .then((res) => {
        setLoading(false);
        setList([...res.data.list]);
      })
      .catch((err) => {
        console.log(err);
      });
    // getProjects();
    socket = socketIo(ENDPOINT, { transports: ["websocket"] });
    socket.on("connect", () => {
      setSocketId(socket.id);
    });
    socket.emit("joined", { user: state?.id });
    socket.on("userJoined", (data) => {});
    socket.on("leave", (data) => {
      console.log(data.user, data.message);
    });
    return () => {
      socket.emit("disconn");
      socket.off();
    };
  }, []);
  const submitHandler = async (e) => {
    e.preventDefault();
    if (
      project.topic === "" ||
      project.category.name === "" ||
      project.description === ""
    ) {
      setValidation(true);
      return;
    }
    const payload = {
      ...project,
      category: {
        name: state.name,
        id: selectedMember,
      },
    };
    try {
      const result = await axios.post(
        "http://localhost:8080/project/studentData",
        payload
      );
      toast.success(result.data.message);
      socket.emit("message", {
        message: { ...payload, receiver_id: selectedMember },
        id: socketId,
      });
      setProject({
        ...payload,
        topic: "",
        category: {
          name: "",
          id: "",
        },
        searchCategory: "",
        description: "",
        file: "",
      });
    } catch (err) {
      toast.error(err.response.data.message);
    }
  };
  const memberHandler = (name, id) => {
    setProject((project) => ({
      ...project,
      category: {
        name: name,
        id: id,
      },
    }));
    setSelectedMember(id);
  };
  const changeHandler = async (e) => {
    if (e.target.name === "file") {
      const reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = () => {
        setProject((v) => ({ ...v, [e.target.name]: reader.result }));
      };
    }
    setProject((project) => ({ ...project, [e.target.name]: e.target.value }));
    if (e.target.name === "searchCategory") {
      const searchResult = await axios.get(
        `http://localhost:8080/search/category?name=${e.target.value}`
      );
      setList([...searchResult.data]);
    }
  };
  const chatHandler = (chatMember) => {
    setSelectedChat(chatMember);
  };
  return (
    <div className="dashboard">
      <ToastContainer />
      {state?.category === "Supervisor" ? (
        <Navigate to="/projects" state={{ list: projectList, user: state }} />
      ) : (
        <div className="bottom-content">
          <div className="form-section">
            <form onSubmit={(e) => submitHandler(e)}>
              <div>
                <label>Topic</label>
                <input
                  type="text"
                  name="topic"
                  onChange={changeHandler}
                  value={project.topic}
                />
                {validation && project.topic === "" && (
                  <error>Please enter project topic</error>
                )}
              </div>
              <div>
                <label>{category}</label>
                <input
                  type="text"
                  readOnly
                  value={project.category.name}
                  name="category"
                />
                {validation && project.category.name === "" && (
                  <error>{`Please enter ${state.category}`}</error>
                )}
              </div>
              <div>
                <label>Description</label>
                <textarea
                  name="description"
                  onChange={changeHandler}
                  value={project.description}
                />
                {validation && project.description === "" && (
                  <error>Please enter project description</error>
                )}
              </div>
              <div>
                <input
                  type="file"
                  accept="pdf"
                  name="file"
                  onChange={changeHandler}
                />
              </div>
              <button type="submit" onClick={(e) => submitHandler(e)}>
                Send
              </button>
            </form>
          </div>
          <div className="right-content">
            <div className="search">
              <label>Search Category</label>
              <input
                type="search"
                name="searchCategory"
                onChange={changeHandler}
                value={project.searchCategory}
              />
            </div>
            <ul>
              <ClipLoader
                color="green"
                loading={loading}
                size={50}
                aria-label="Loading Spinner"
                data-testid="loader"
              />
              {list.map((item, i) => {
                return (
                  <li key={i}>
                    <div
                      onClick={() =>
                        memberHandler(item.firstName + item.lastName, item._id)
                      }
                    >
                      {item.firstName}-{item.lastName}
                    </div>
                    <div>
                      <FontAwesomeIcon
                        icon={faCommentDots}
                        onClick={() =>
                          chatHandler(item.firstName + item.lastName)
                        }
                      />
                      <img src={item.profileImage} alt="profile" />
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
          {selectedChat && <Chat name={selectedChat} closeChat={chatHandler} />}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
