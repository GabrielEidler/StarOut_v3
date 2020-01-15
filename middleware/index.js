var Campground = require("../models/campground");
var Comment = require("../models/comment");
// all the middleware goes here
var middlewareObj = {
  checkCampgroundOwnership: function(req, res, next) {
    // is user logged in
    if (req.isAuthenticated()) {
      Campground.findById(req.params.id, (err, foundCampground) => {
        if (err) {
          res.redirect("back");
        } else {
          // Added this block, to check if foundCampground exists, and if it doesn't to throw an error via connect-flash and send us back to the homepage
          if (!foundCampground) {
            req.flash("error", "Item not found.");
            return res.redirect("back");
          }

          //does user own campground?
          if (foundCampground.author.id.equals(req.user._id)) {
            next();
          } else {
            req.flash("error", "you don't have permission to do that");
            res.redirect("back");
          }
        }
      });
    } else {
      req.flash("error", "you need to be logged  in to do that");
      res.redirect("back");
    }
  },

  checkCommentOwnership: function(req, res, next) {
    // is user logged in
    if (req.isAuthenticated()) {
      Comment.findById(req.params.comment_id, (err, foundComment) => {
        if (err) {
          res.redirect("back");
        } else {
          //does user own comment?
          if (foundComment.author.id.equals(req.user._id)) {
            next();
          } else {
            req.flash("error", "you don't have permission to do that");
            res.redirect("back");
          }
        }
      });
    } else {
      req.flash("error", "you need to be logged  in to do that");
      res.redirect("back");
    }
  },

  isLoggedIn: function(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash("error", "Please Login First!");
    res.redirect("/login");
  }
};

/*
DEFINING AFTER THE FACT
middlewareObj.checkCampgroundOwnership() = function(){

};

middlewareObj.checkCommentOwnership() = function(){

};
*/

module.exports = middlewareObj;
