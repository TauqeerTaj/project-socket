import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";

function Signin() {
  const [loading, setLoading] = useState(false);
  const [signinData, setSigninData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const handleChange = (e) => {
    setSigninData((v) => ({ ...v, [e.target.name]: e.target.value }));
  };
  const submitHandler = (e) => {
    e.preventDefault();
    setLoading(true);
    axios
      .post("http://localhost:8080/auth/login", signinData)
      .then((res) => {
        if (res) {
          localStorage.setItem("token", res.data.token);
          localStorage.setItem(
            "headerData",
            JSON.stringify({
              name: res.data.user.firstName + res.data.user.lastName,
              profile: res.data.user.profileImage,
              category: res.data.user.category,
            })
          );
          setLoading(false);
          navigate("./dashboard", {
            state: {
              name: res.data.user.firstName + res.data.user.lastName,
              profile: res.data.user.profileImage,
              category: res.data.user.category,
              id: res.data.user._id,
            },
          });
        }
      })
      .catch((err) => console.log(err));
  };
  return (
    <div className="signin">
      <ClipLoader
        color="green"
        loading={loading}
        size={50}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
      <h2>Sign In</h2>
      <form onSubmit={submitHandler}>
        <div>
          <label>Email</label>
          <input type="email" name="email" onChange={handleChange} />
        </div>
        <div>
          <label>Password</label>
          <input type="password" name="password" onChange={handleChange} />
        </div>
        <div className="action-button">
          <button type="submit">Sign In</button>
          <Link to="/signup">Sign up</Link>
        </div>
      </form>
    </div>
  );
}

export default Signin;
