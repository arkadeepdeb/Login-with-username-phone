var express = require("express"),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  passport = require("passport"),
  User = require("./models/user"),
  LocalStrategy = require("passport-local"),
  passportLocalMongoose = require("passport-local-mongoose"),
  expressSession = require("express-session"),
  initDB = require("./database/"),
  baseRoutes = require("./routes/index");
app = express();

initDB([User]);
//

// application wide middleware goes first
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//session management
app.use(
  expressSession({
    secret: "Rusty is the best and cutest dog in the world", // this is a secret key that is used to emcrypt your  session
    resave: false,
    saveUninitialized: false,
  })
);

app.set("view engine", "ejs");
app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

app.use("/", baseRoutes);

/**
 * Step1 : ensure you have received data values from the form
 * Step 2 ensure they are not UNDEFINED - this can be accomplished client-side
 * //for instance, you may decide to prevent form submission if the fields are empty
 *
 * //Step 3 ensure that your username field matches :
 *  PHONE
 *    - entirely numeric
 *     - size 10 digits ONLY
 *     - further security checks ,such as cleaning the input with String.replace() method
 *        - sanitization checks basically
 *   USERNAME
 *   - email only ?
 *   - alpha characters ?
 *   -  numeric chars ?
 *   -  minimum length ?
 *   -  special chars ?  ^ & % ! etc
 *
 * // what you need to do is ,if you look at your USER MODEL,
 * //
 *
 *
 */

const PORT = process.env.PORT || 8080;

app.listen(PORT, process.env.IP, function () {
  console.log(`Server started on port ${PORT}`);
});
