var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");

//------------- INDEX ROUTE -------------\\
router.get("/", function(req, res) {
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

//------------- Create ROUTE -------------\\
router.post("/", isLoggedIn, function(req, res) {
  // get data from form and add to campground
  var name = req.body.name;
  var image = req.body.image;
  var description = req.body.description;
  var author = {
    id: req.user._id,
    username: req.user.username
  };
  var newCampground = {
    name: name,
    image: image,
    description: description,
    author: author
  };
  console.log(author.username);

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
router.get("/new", isLoggedIn, function(req, res) {
  res.render("campgrounds/new.ejs");
});

//------------- SHOW ROUTE -------------\\
router.get("/:id", (req, res) => {
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

//middleware
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

module.exports = router;
