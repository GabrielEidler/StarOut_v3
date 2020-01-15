var express = require("express");
var router = express.Router();
var User = require("../models/user");
var passport = require("passport");

//===========
//AUTH ROUTES

//show register form
router.get("/register", (req, res) => {
  res.render("register");
});

//handle register
router.post("/register", (req, res) => {
  var newUser = new User({ username: req.body.username });
  User.register(newUser, req.body.password, (err, user) => {
    if (err) {
      req.flash("error", err.message);
      return res.render("register");
    }
    passport.authenticate("local")(req, res, () => {
      req.flash("success", "welcome to OutStar " + user.username);
      res.redirect("/campgrounds");
    });
  });
});

//show login form
router.get("/login", (req, res) => {
  res.render("login");
});

//login logic
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
  }),
  (req, res) => {}
);

//logout Route
router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success", "LOGGED OUT");
  res.redirect("/campgrounds");
});

module.exports = router;
