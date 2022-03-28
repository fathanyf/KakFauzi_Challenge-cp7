const express = require("express");
const app = express();
const session = require("express-session");
const flash = require("express-flash");
const { PORT = 8000 } = process.env;
const router = require("./router");
const passport = require("./lib/passport");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(
  session({
    secret: "rahasia fathan",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(router);

app.set("view engine", "ejs");

app.listen(PORT, () => {
  console.log(`Server running port ${PORT}`);
});
