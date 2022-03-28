const router = require("express").Router();
const auth = require("./controllers/authController");
const restrict = require("./middlewares/restrict");

router.get("/", auth.index);
router.get("/register", auth.formRegister);
router.get("/login", auth.formLogin);

router.post("/login", auth.login);
router.post("/register", auth.register);
router.get("/logout", auth.logout);

router.get("/history", restrict, auth.history);
router.get("/createroom", restrict, auth.formRoom);
router.post("/room", restrict, auth.createRoom);
router.get("/game", restrict, auth.game);

module.exports = router;
