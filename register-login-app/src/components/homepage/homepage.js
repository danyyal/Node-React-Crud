import React, { useEffect } from "react";
import "./homepage.css";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { getReq, postReq } from "../../Requests/axiosClient";
import { message } from "antd";
const Homepage = ({}) => {
  const auth = Cookies.get("authToken");
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth) {
      message.warning(
        "User not logged in. Please login first in."
      );
      message.warning("Redirecting to login page");
      navigate("/login");
    }
  }, [auth, navigate]);
  return (
    <div className="homepage">
      <h1>Hello Homepage</h1>
      <div
        onClick={() => {
          const response = postReq("logout", null, auth);
          response
            .then((res) => {
              message.success(res.data.message);
              navigate("/login");
              Cookies.remove("authToken");
            })
            .catch((err) => {
              // console.log(err)
            });
        }}
        className="button"
      >
        Logout
      </div>
      <div
        onClick={async () => {
          try {
            const response = await getReq("/test-api", auth);
            message.success(response.data.message);
          } catch (err) {
            message.error(err?.response?.data?.message);
          }
        }}
        className="button"
        style={{ marginTop: "50px", padding: "10px" }}
      >
        TEST API CALL
      </div>
    </div>
  );
};

export default Homepage;
