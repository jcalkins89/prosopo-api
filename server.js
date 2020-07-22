const express = require("express");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const knex = require("knex");

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
//   .then((data) => {});

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send(database.users);
});

app.listen(3000, () => {
  console.log("app is running on port 3000");
});

app.post("/signin", (req, res) => {
  db.select("email", "hash")
    .from("login")
    .where("email", "=", req.body.email)
    .then((data) => {
      const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
      if (isValid) {
        return db
          .select("*")
          .from("users")
          .where("email", "=", req.body.email)
          .then((user) => {
            res.json(user[0]);
          })
          .catch((err) => res.status(400).json("Unable to fetch user"));
      } else {
        res.status(400).json("Wrong Credentials");
      }
    })
    .catch((err) => res.status(400).json("Wrong Credentials"));
});

app.post("/register", (req, res) => {
  const { email, name, password } = req.body;

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);

  db.transaction((trx) => {
    trx
      .insert({
        hash: hash,
        email: email,
      })
      .into("login")
      .returning("email")
      .then((loginEmail) => {
        return trx("users")
          .returning("*")
          .insert({
            email: loginEmail[0],
            name: name,
            joined: new Date(),
          })
          .then((user) => {
            res.json(user[0]);
          });
      })
      .then(trx.commit)
      .then(trx.rollback);
  }).catch((err) => res.status(400).json("Unable to register"));
});

app.get("/profile/:id", (req, res) => {
  const { id } = req.params;

  db.select("*")
    .from("users")
    .where({ id })
    .then((user) => {
      if (user.length) {
        res.json(user[0]);
      } else {
        res.status(400).json("Not Found");
      }
    })
    .catch((err) => res.status(400).json("Error fetching user"));
});

app.put("/image", (req, res) => {
  const { id } = req.body;

  db("users")
    .where("id", "=", id)
    .increment("entries", 1)
    .returning("entries")
    .then((entries) => {
      res.json(entries[0]);
    })
    .catch((err) => {
      res.status(400).json("Unable to fetch entries");
    });
});
