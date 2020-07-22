const express = require("express");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const knex = require("knex");

const register = require("./controllers/register");
const signin = require("./controllers/signin");
const profile = require("./controllers/profile");
const image = require("./controllers/image");

const db = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    user: "joshcalkins",
    password: "",
    database: "prosopo-db",
  },
});

db.select("*").from("users");

const app = express();
app.use(express.json());
app.use(cors());

app.listen(3000, () => {
  console.log("app is running on port 3000");
});

app.post("/signin", signin.handleSignIn(db, bcrypt));
app.post("/register", register.handleRegister(db, bcrypt));
app.get("/profile/:id", profile.handleGetProfile(db));
app.put("/image", image.handleImageRequest(db));
