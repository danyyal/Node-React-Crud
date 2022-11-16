import React, { useEffect, useState } from "react";
import "./login.css";
import Cookies from "js-cookie";
import { message } from "antd";
import { postReq } from "../../Requests/axiosClient";
import { NavLink, useNavigate } from "react-router-dom";
const Login = ({}) => {
  const navigate = useNavigate();
  const auth = Cookies.get("authToken");
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    if (auth) {
      message.warning(
        "User already logged in. Please logout first in order to login using another user"
      );
      message.warning("Redirecting to user dashboard");
      navigate("/dashboard");
    }
  }, [auth, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };
  const loginHandler = () => {
    const { email, password } = user;
    if (email && password) {
      const params = {
        email: email,
        password: password,
      };
      const response = postReq("login", params, null);
      response
        .then((res) => {
          message.success(res.data.message);
          const authToken = res.data.data.accessToken;
          Cookies.set("authToken", "Bearer " + authToken);
          navigate("/dashboard");
        })
        .catch((err) => {
          message.error(err?.response?.data?.message);
        });
    } else {
      message.error("Fill the form correctly");
    }
  };
  return (
    <div className="login">
      <h1>login</h1>
      <input
        type={"text"}
        name="email"
        value={user.email}
        onChange={handleChange}
        placeholder="Enter your Email"
      />
      <input
        type={"password"}
        name="password"
        value={user.password}
        onChange={handleChange}
        placeholder="Enter your password"
      />
      <div onClick={loginHandler} className="button">
        Login
      </div>
      <div>or</div>
      <div className="button">
        <NavLink className={"navlink"} to={"/register"}>
          Register
        </NavLink>
      </div>
    </div>
  );
};

export default Login;
