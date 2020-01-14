var express = require("express");
var router = express.Router({ mergeParams: true });
var Campground = require("../models/campground");
var Comment = require("../models/comment");

// Comments New
router.get("/new", isLoggedIn, (req, res) => {
  //find campground by id
  Campground.findById(req.params.id, (err, foundCampground) => {
    if (err) {
      console.log(err);
    } else {
      res.render("comments/new", { campground: foundCampground });
    }
  });
});

// Comments Create
router.post("/", isLoggedIn, (req, res) => {
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
          //add username and id to comment
          newComment.author.username = req.user.username;
          newComment.author.id = req.user._id;
          //save comment
          newComment.save();

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

//middleware
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

module.exports = router;
