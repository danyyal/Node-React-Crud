import React, { useState, useEffect } from "react";
import "./register.css";
import axios from "axios";
import { message } from "antd";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { postReq } from "../../Requests/axiosClient";
import { NavLink } from "react-router-dom";
const Register = ({}) => {
  const auth = Cookies.get("authToken");
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  useEffect(() => {
    if (auth) {
      message.warning("User already logged in. Please logout first.");
      message.warning("Redirecting to user dashboard");
      navigate("/dashboard");
    }
  }, [auth, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };
  const registerHandler = () => {
    const { name, email, password, confirm_password } = user;
    if (
      name.length > 0 &&
      email.length > 0 &&
      password === confirm_password &&
      password.length > 0
    ) {
      const params = {
        name: name,
        email: email,
        password: password,
      };
      const response = postReq("register", params, null);
      response
        .then((res) => {
          message.success(res.data.message);
          navigate("/login");
        })
        .catch((err) => {
          message.error(err?.response?.data?.message);
        });
    } else {
      if (
        name.length > 0 &&
        email.length > 0 &&
        password !== confirm_password &&
        password.length > 0
      ) {
        message.error("passwords does not match");
      } else message.error("Fill the form correctly");
    }
  };
  return (
    <div className="register">
      <h1>Register</h1>
      <input
        type={"text"}
        name="name"
        value={user.name}
        placeholder="Your Name"
        onChange={handleChange}
      />
      <input
        type={"email"}
        name="email"
        value={user.email}
        placeholder="Your Email"
        onChange={handleChange}
      />
      <input
        type={"password"}
        name="password"
        value={user.password}
        placeholder="Your password"
        onChange={handleChange}
      />
      <input
        type={"password"}
        name="confirm_password"
        value={user.confirm_password}
        placeholder="Re-enter password"
        onChange={handleChange}
      />
      <div onClick={registerHandler} className="button">
        Register
      </div>
      <div>or</div>
      <div className="button">
        <NavLink className={"navlink"} to={"/login"}>
          Login
        </NavLink>
      </div>
    </div>
  );
};

export default Register;
