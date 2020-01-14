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

mongoose.connect(
  "mongodb+srv://gabrieleidler:theceltichero159357@cluster0-nh3lc.mongodb.net/starout?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
);

// ===========================================================
// DATABASE STUFF
// ===========================================================

// ===========================================================
// ROUTES
// ===========================================================

app.get("/", function(req, res) {
  res.render("landing");
});

//------------- INDEX ROUTE -------------\\
app.get("/campgrounds", function(req, res) {
  //Get All Campgrounds from DB
  Campground.find({}, (err, campgrounds) => {
    if (err) {
      console.log(err);
    } else {
      res.render("campgrounds/index", {
        campgrounds: campgrounds
      });
    }
  });
});

//------------- NEW ROUTE -------------\\
app.post("/campgrounds", function(req, res) {
  // get data from form and add to campground
  var name = req.body.name;
  var image = req.body.image;
  var description = req.body.description;
  var newCampground = { name: name, image: image, description: description };
  //Create New Campground and save to database
  Campground.create(newCampground, (err, newlyCreated) => {
    if (err) {
      console.log(err);
    } else {
      //redirect back to campgrounds page
      res.redirect("/campgrounds");
    }
  });
});

//------------- NEW ROUTE -------------\\
app.get("/campgrounds/new", function(req, res) {
  res.render("campgrounds/new.ejs");
});

//------------- SHOW ROUTE -------------\\
app.get("/campgrounds/:id", (req, res) => {
  //find the caampground provided ID
  var id = req.params.id;
  Campground.findById(id)
    .populate("comments")
    .exec((err, foundCampground) => {
      if (err) {
        console.log(err);
      } else {
        //render show template with that campground
        res.render("campgrounds/show", { campground: foundCampground });
      }
    });
});

//------------- COMMENTS ROUTE -------------\\
app.get("/campgrounds/:id/comments/new", isLoggedIn, (req, res) => {
  //find campground by id
  Campground.findById(req.params.id, (err, foundCampground) => {
    if (err) {
      console.log(err);
    } else {
      res.render("comments/new", { campground: foundCampground });
    }
  });
});

app.post("/campgrounds/:id/comments", isLoggedIn, (req, res) => {
  //lookup campground using Id
  Campground.findById(req.params.id, (err, foundCampground) => {
    if (err) {
      console.log(err);
      res.redirect("/campgrounds");
    } else {
      //create new comment
      Comment.create(req.body.comment, (err, newComment) => {
        if (err) {
          console.log(err);
        } else {
          //connect new comment to campground
          foundCampground.comments.push(newComment);
          foundCampground.save();
          //redirect to campground Show page
          res.redirect("/campgrounds/" + foundCampground._id);
        }
      });
    }
  });
});

//===========
//AUTH ROUTES

//show register form
app.get("/register", (req, res) => {
  res.render("register");
});

//handle register
app.post("/register", (req, res) => {
  var newUser = new User({ username: req.body.username });
  User.register(newUser, req.body.password, (err, user) => {
    if (err) {
      console.log(err);
      return res.render("register");
    }
    passport.authenticate("local")(req, res, () => {
      res.redirect("/campgrounds");
    });
  });
});

//show login form
app.get("/login", (req, res) => {
  res.render("login");
});

//login logic
app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
  }),
  (req, res) => {}
);

//logout Route
app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/campgrounds");
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

app.listen(8080, function() {
  console.log("The YelpCamp Server Has Started!");
});
