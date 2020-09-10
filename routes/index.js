const express = require("express");
const router = express.Router();
const User = require("../models/user");
const {
  normaliseUsername,
  validateRegister,
  validateLogin,
  userIsLoggedIn,
} = require("../middlewares/index");

router.get("/", function (req, res) {
  res.render("landing");
});

router.post("/register", validateRegister, async function (req, res, next) {
  const { username, phone, password } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return next(`user exists!`);
    }

    let newUser = new User({ username, password, phone });
    await newUser.save();
    res.json({ page: "I am here" });
  } catch (error) {
    next(`ooh snap ! something went wrong ${error}`);
  }
});

router.post(
  "/login",
  normaliseUsername,
  validateLogin,
  async (req, res, next) => {
    try {
      //once you have gone through the process of :
      // 1/ making sure user record exists

      const existingUser = await User.findOne({
        $or: [{ username: req.body.username }, { phone: req.body.phone }],
      });
      //,, well yes ,,there's so many steps for you to consider
      // frameworks/libaries simplify our workflow,,,,but most times, you must really understand what is going on and WHY is it happenning to be really able to customize it
      if (existingUser) {
        // what I would advise you to do :

        req.user = existingUser;
        const result = await existingUser.comparePassword(req.body.password);
        console.log(result);
        res.json({ output: result });
      }
    } catch (error) {
      next(`Error happened !, ${error}`);
    }
  }
);

// Showing dashboard
router.get("/dashboard", function (req, res) {
  res.render("dashboard");
});

router.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/");
});

module.exports = router;
