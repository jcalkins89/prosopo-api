const express = require("express");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const knex = require("knex");

const register = require("./controllers/register");
const signin = require("./controllers/signin");
const profile = require("./controllers/profile");
const image = require("./controllers/image");

process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

const db = knex({
  client: "pg",
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: true,
  },
});

db.select("*").from("users");

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("App is fully functional!");
});
app.post("/signin", signin.handleSignIn(db, bcrypt));
app.post("/register", register.handleRegister(db, bcrypt));
app.get("/profile/:id", profile.handleGetProfile(db));
app.put("/image", image.handleImageRequest(db));
app.post("/imageurl", image.handleApiCall);

app.listen(process.env.PORT || 3000, () => {
  console.log(`app is running on port ${process.env.PORT}`);
});
