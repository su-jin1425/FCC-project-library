const { Schema } = require("mongoose");

const BookSchema = new Schema({
  title: {type: String, required: true},
  comments: [String],
  commentcount: Number,
});

exports.BookSchema = BookSchema;
