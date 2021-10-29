const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema({
  BookName: { type: String, required: true, unique: true },
  Author: { type: String, required: true },
  ReadStartDate: {
    type: String
  },
  Completed: { type: Boolean, default: false },
  CompletedDate: { type: String }
});

const Book = mongoose.model("Book", BookSchema);

module.exports = Book;
