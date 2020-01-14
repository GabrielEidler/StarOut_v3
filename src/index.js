// ===========================================================
// SETUP
// ===========================================================
const express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  // Using Node.js `require()`
  mongoose = require("mongoose"),
  passport = require("passport"),
  LocalStrategy = require("passport-local"),
  Campground = require("../models/campground"),
  Comment = require("../models/comment"),
  User = require("../models/user.js"),
  seedDb = require("../seeds.js"),
  path = require("path");

var commentRoutes = require("../routes/comments"),
  campgroundRoutes = require("../routes/campgrounds"),
  appRoutes = require("../routes/app");

//seedDb();
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(path.dirname(__dirname) + "/public"));

// ===== PASSPORT CONFIGURATION ======
app.use(
  require("express-session")({
    secret: "Almonds Are Delicious",
    resave: false,
    saveUninitialized: false
  })
);

app.use(passport.initialize());
app.use(passport.session());
// User.authenticate comes from passs-loc-mongo
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

// requiring routes
app.use("/", appRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);

// ===========================================================
// DATABASE STUFF
// ===========================================================

mongoose.connect(
  "mongodb+srv://gabrieleidler:theceltichero159357@cluster0-nh3lc.mongodb.net/starout?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
);

// ===========================================================
// ROUTES
// ===========================================================

app.get("/", function(req, res) {
  res.render("landing");
});

app.listen(8080, function() {
  console.log("The YelpCamp Server Has Started!");
});
