import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudUpload } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./form.css";

function Signup() {
  const [profileImage, setProfileImage] = useState();
  const [signupData, setSignupData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    category: "",
    profileImage: "",
  });
  const navigate = useNavigate();
  const handleChange = (e) => {
    if (e.target.name === "profileImage") {
      setProfileImage(URL.createObjectURL(e.target.files[0]));
      const reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = () => {
        setSignupData((v) => ({ ...v, [e.target.name]: reader.result }));
      };
    }
    setSignupData((v) => ({ ...v, [e.target.name]: e.target.value }));
  };
  const submitHandler = (e) => {
    e.preventDefault();
    axios
      .put("http://localhost:8080/auth/signup", signupData)
      .then((res) => {
        if (res.data.message) {
          navigate("/");
        }
      })
      .catch((err) => console.log(err));
  };
  return (
    <div className="signup">
      <h2>Sign Up</h2>
      <form onSubmit={submitHandler}>
        <div>
          <label>First Name</label>
          <input type="text" onChange={handleChange} name="firstName" />
        </div>
        <div>
          <label>Last Name</label>
          <input type="text" onChange={handleChange} name="lastName" />
        </div>
        <div>
          <label>Email</label>
          <input type="email" onChange={handleChange} name="email" />
        </div>
        <div>
          <label>Password</label>
          <input type="password" onChange={handleChange} name="password" />
        </div>
        <div>
          <label>Category</label>
          <select onChange={handleChange} name="category">
            <option>Select Category</option>
            <option>Supervisor</option>
            <option>Student</option>
          </select>
        </div>
        <div>
          <label className="custom-file-upload">
            <input type="file" onChange={handleChange} name="profileImage" />
            Upload Image
            <FontAwesomeIcon icon={faCloudUpload} />
          </label>
          <div className="imagebox">
            {profileImage && <img src={profileImage} alt="profile image" />}
          </div>
        </div>
        <div>
          <button type="submit">Sign Up</button>
        </div>
      </form>
    </div>
  );
}

export default Signup;
