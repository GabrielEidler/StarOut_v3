const mongoose = require("mongoose");

//SCHEMA SET UP
var commentSchema = mongoose.Schema({
  text: String,
  author: String
});

module.exports = mongoose.model("Comment", commentSchema);
