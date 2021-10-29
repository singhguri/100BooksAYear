const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema({
  BookName: { type: String, required: true },
  Author: { type: String, required: true },
  ReadStartDate: { type: Date, default: new Date() },
  Completed: { type: Boolean, default: false },
  CompletedDate: { type: Date },
});

const Book = mongoose.model("Book", BookSchema);

module.exports = Book;
