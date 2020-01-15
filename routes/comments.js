var express = require("express");
var router = express.Router({ mergeParams: true });
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

// Comments New
router.get("/new", middleware.isLoggedIn, (req, res) => {
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
router.post("/", middleware.isLoggedIn, (req, res) => {
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

//EDIT
router.get("/:comment_id/edit", middleware.checkCommentOwnership, (req, res) => {
  Comment.findById(req.params.comment_id, (err, foundComments) => {
    if (err) {
      res.redirect("back");
    } else {
      res.render("comments/edit", {
        campground_id: req.params.id,
        comment: foundComments
      });
    }
  });
});

//UPDATE

router.put("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
  Comment.findByIdAndUpdate(
    req.params.comment_id,
    req.body.comment,
    (err, updatedComment) => {
      if (err) {
        res.redirect("back");
      } else {
        res.redirect("/campgrounds/" + req.params.id);
      }
    }
  );
});

//DESTROY
router.delete("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
  Comment.findByIdAndRemove(req.params.comment_id, err => {
    console.log("comment deleted.");
    res.redirect("/campgrounds/" + req.params.id);
  });
});


module.exports = router;
