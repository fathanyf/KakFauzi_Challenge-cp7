const { User, UserHistory } = require("../models");
const passport = require("../lib/passport");
const jwt = require("jsonwebtoken");

function format(user) {
  const { id, username } = user;
  return {
    id,
    username,
    accessToken: user.generateToken(),
  };
}

module.exports = {
  index: (req, res) => res.render("index"),
  history: async (req, res) => {
    const token = req.cookies.jwt;
    const payload = jwt.verify(token, "rahasia fathan");
    const { username } = payload;

    User.findAll({
      model: User,
      where: { username: username },
      include: { model: UserHistory },
    })
      .then((a) => {
        // res.json(a);
        res.render("history", { a });
      })
      .catch((err) => console.log(err));
  },
  formRoom: (req, res) => res.render("create"),
  formRegister: (req, res) => res.render("register"),
  formLogin: (req, res) => res.render("login"),
  register: async (req, res, next) => {
    try {
      User.register(req.body);
      res.render("login", { message: "Register successfully, please login" });
    } catch (err) {
      let messages = {};
      messages.error = "Username already exist in database";
      res.render("register", { messages });
      console.log(err);
    }
  },
  login: (req, res) => {
    User.authenticate(req.body)
      .then((user) => {
        const token = format(user).accessToken;

        res.cookie("jwt", token, { httpOnly: true });
        res.redirect("/history");
      })
      .catch((err) => {
        console.log(err);
        let messages = {};
        messages.error = "Check your login data again";
        res.render("login", { messages });
      });
  },
  logout: (req, res) => {
    res.cookie("jwt", "", { maxAge: 1 });
    res.render("login");
  },
  game: (req, res) => {
    User.findOne({
      model: User,
      where: { id: req.user.id },
      include: { model: UserHistory },
    })
      .then((a) => {
        // res.json(a);
        res.status(200).render("game", { a });
      })
      .catch((err) => console.log(err));
  },
  createRoom: (req, res) => {
    UserHistory.create({
      room_name: req.body.room_name,
      UserId: req.user.id,
    });
    User.findAll({
      model: User,
      where: { username: req.user.username },
      include: { model: UserHistory },
    })
      .then((a) => {
        // res.json(a);
        res.render("history", { a });
      })
      .catch((err) => console.log(err));
  },
};
