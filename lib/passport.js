const passport = require("passport");
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const { User } = require("../models");

// const express = require("express");
// const bodyParser = require("body-parser");
// const cookieParser = require("cookie-parser");

// const app = express();

// app.use(express.urlencoded({ extended: false }));
// app.use(bodyParser.json());
// app.use(cookieParser());

async function authenticate(username, password, done) {
  try {
    const user = await User.authenticate({ username, password });
    return done(null, user);
  } catch (err) {
    return done(null, false, { message: err.message });
  }
}

const options = {
  // jwtFromRequest: ExtractJwt.fromHeader("authorization"),
  // secretOrKey: "rahasia fathan",

  jwtFromRequest: (req, res) => {
    const jwt = req.cookies.jwt;
    return jwt;
  },
  secretOrKey: "rahasia fathan",
};

passport.use(
  new JwtStrategy(options, async (payload, done) => {
    User.findByPk(payload.id)
      .then((user) => done(null, user))
      .catch((err) => done(err, false));
  })
);

module.exports = passport;
