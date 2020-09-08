var bodyParser = require("body-parser"),
  express = require("express"),
  mongoose = require("mongoose"),
  passport = require("passport"),
  User = require("./models/user"),
  LocalStrategy = require("passport-local"),
  passportLocalMongoose = require("passport-local-mongoose"),
  expressSession = require("express-session"),
  app = express();

mongoose.connect("mongodb://localhost:27017/tambola", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  expressSession({
    secret: "Rusty is the best and cutest dog in the world",
    resave: false,
    saveUninitialized: false,
  })
);

app.set("view engine", "ejs");
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

//================
// ROUTES
//================

// Showing home page
app.get("/", function (req, res) {
  res.render("landing");
});

// Showing dashboard
app.get("/dashboard", isLoggedIn, function (req, res) {
  res.render("dashboard");
});

//Handling user signup
app.post("/register", function (req, res) {
  var newUser = new User({
    username: req.body.username,
    phone: req.body.phone,
  });
  User.register(newUser, req.body.password, function (err, user) {
    if (err) {
      console.log(err);
    }
    passport.authenticate("local")(req, res, function () {
      res.redirect("/dashboard");
    });
  });
});

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/",
  })
);

app.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/");
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
}

const PORT = process.env.PORT || 8080;

app.listen(PORT, process.env.IP, function () {
  console.log(`Server started on port ${PORT}`);
});
