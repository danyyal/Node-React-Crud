import "./App.css";
import Homepage from "./components/homepage/homepage";
import Login from "./components/login/login";
import "antd/dist/antd.min.css";
import Register from "./components/register/register";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          {/* <Switch> */}
          <Route path="/login" element={<Login />} />
          <Route exact path="/dashboard" element={<Homepage />} />
          <Route path="/register" element={<Register />} />

          {/* <Redirect /> */}
          {/* </Switch> */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
