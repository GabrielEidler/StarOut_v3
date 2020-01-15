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
          //does user own campground?
          if (foundCampground.author.id.equals(req.user._id)) {
            next();
          } else {
            res.redirect("back");
          }
        }
      });
    } else {
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
            res.redirect("back");
          }
        }
      });
    } else {
      res.redirect("back");
    }
  },

  isLoggedIn: function(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
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
