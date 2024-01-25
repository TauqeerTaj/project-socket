import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { approve, Delete } from "../../../api/project";
import "./style.css";

function ProjectDetails() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [showAttachement, setShowAttachement] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const buttonClickHandler = () => {
    navigate("/dashboard", {
      state: state.user,
    });
  };

  const approveProject = async (id) => {
    const data = await approve(id);
    console.log("approve:", data);
    if (data) {
      toast.success(data);
      setTimeout(() => {
        navigate("/projects", {
          state: {
            user: { ...state.user },
          },
        });
      }, 1000);
    }
  };
  const deleteProject = async (id) => {
    const data = await Delete(id);
    console.log("delete:", data);
    toast.success("Project has been rejected!");
    setTimeout(() => {
      navigate("/projects", {
        state: {
          user: { ...state.user },
        },
      });
    }, 1000);
  };

  const attachementHandler = () => {
    setShowAttachement(!showAttachement);
  };

  return (
    <div
      className={
        state.approved ? "project-details approved" : "project-details"
      }
    >
      <ToastContainer autoClose={1000} />
      <header>
        <button onClick={buttonClickHandler} className="back">
          Back
        </button>
        <h1>Project Details</h1>
        <div className="action">
          <button
            className="approve"
            onClick={() => approveProject(state?._id ?? state?.id)}
          >
            Approve
          </button>
          <button
            className="reject"
            onClick={() => deleteProject(state?._id ?? state?.id)}
          >
            Reject
          </button>
        </div>
      </header>
      <div className="content">
        <div className="details-header">
          <div>
            <h3>Project:</h3>
            <span>{state?.projectName ?? state?.topic}</span>
          </div>
          <div>
            <h3>Name:</h3>
            <span>{state.category.name}</span>
          </div>
        </div>
        <div className="description">
          <h3>Description:</h3>
          <span>{state.projectDescription ?? state?.description}</span>
        </div>
        <div className="pdf-button">
          {state?.file && (
            <button onClick={attachementHandler}>Show attachement</button>
          )}
        </div>
        {showAttachement && (
          <div className="iframe-parent">
            <div className="close-iframe">
              <FontAwesomeIcon icon={faClose} onClick={attachementHandler} />
            </div>
            <iframe src={state?.file} />
          </div>
        )}
      </div>
    </div>
  );
}

export default ProjectDetails;
