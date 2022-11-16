const {
  ReasonPhrases,
  StatusCodes,
  getReasonPhrase,
  getStatusCode,
} = require("http-status-codes");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { generateToken, validateToken } = require("./TokenVerification");
dotenv.config();
const PORT = 4200;

const app = express();

app.use(express.json());
app.use(express.urlencoded());
app.use(cors());

mongoose
  .connect("mongodb://127.0.0.1:27017/myLoginRegisterDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Database connected"))
  .catch((err) => console.log(err));
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
});

// Creating schema for DB
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

// Creating model and registering schema with model
const User = new mongoose.model("User", userSchema);

//Routes
app.get("/test-api", (req, res) => {
  const isValid = validateToken(req);
  if (isValid) {
    res.status(StatusCodes.ACCEPTED);
    res.send({ message: getReasonPhrase(StatusCodes.ACCEPTED) });
  } else {
    res.status(StatusCodes.UNAUTHORIZED);
    res.send({
      message:
        getReasonPhrase(StatusCodes.UNAUTHORIZED) + " Please login first.",
    });
  }
});

// login
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email: email }, (err, user) => {
    if (!user) {
      res.status(401);
      res.send({ message: "User not registered." });
    } else if (user.password === password) {
      const token = generateToken(user);
      const data = {
        user: {
          attributes: {
            name: user.name,
            email: user.email,
            password: user.password,
          },
        },
        accessToken: token,
      };
      res.status(200);
      res.send({ message: "User logged in successfully.", data: data });
    } else {
      res.status(401);
      res.send({ message: "Invalid password" });
    }
  });
});

// register
app.post("/register", (req, res) => {
  const { name, email, password } = req.body;
  User.findOne({ email: email }, (err, user) => {
    if (user) {
      res.status(401);
      res.send({ message: "user already registered." });
    } else {
      const user = new User({
        name,
        email,
        password,
      });
      user.save((err) => {
        if (err) {
          console.log(err, "error from db connection call");
          res.status(500);
          res.send(err);
        } else {
          res.status(201);
          res.send({ message: "user registered successfully" });
        }
      });
    }
  });
});

app.post("/logout", (req, res) => {
  const isValid = validateToken(req);
  if(isValid){

    res.status(200);
    res.send({
      message: "Sucessfully logged out.",
    });
  }else{
    res.status(StatusCodes.BAD_REQUEST);
    res.send({
      message: "Please login again.",
    });
  }
});

//registering PORT
app.listen(PORT, () => {
  console.log("BE started at port ", PORT);
});
