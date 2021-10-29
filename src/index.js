const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();

const Book = require("./models/book");

// Require static assets from public folder
app.use(express.static(path.join(__dirname, "public")));

// Set 'views' directory for any views
// being rendered res.render()
app.set("views", path.join(__dirname, "views"));

// Set view engine as EJS
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");

// app.use(express.urlencoded({ extended: true }));
app.use(bodyParser());

const books = [
  {
    BookName: "Meluha",
    Author: "Amish",
  },
  {
    BookName: "Vayuputras",
    Author: "Amish",
  },
  {
    BookName: "Nagas",
    Author: "Amish",
  },
  {
    BookName: "ABC Murders",
    Author: "Agatha Christie",
  },
];

app.get("/", async (req, res) => {
  // const books = await Book.find({});

  res.render("book.ejs", { books });
});

app.post("/", async (req, res) => {
  // console.log(req.body);

  const book = new Book({
    BookName: req.body.BookName,
    Author: req.body.Author,
    ReadStartDate: req.body.ReadStartDate,
    Completed: req.body.Completed == "on" ? true : false,
    CompletedDate: req.body.CompletedDate,
  });

  // console.log(new Date().toLocaleString());

  try {
    // await book.save();
    if (book.BookName != "" && book.Author != "") books.push(book);

    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.redirect("/");
  }
});

app
  .route("/edit/:BookName")
  .get((req, res) => {
    const bookName = req.params.BookName;
    var filteredBooks = books.filter((x) => x.BookName == bookName);

    // const book = Book.find({'BookName': bookName}, (err, tasks) => {
    //   res.render("bookEdit.ejs", { filteredBooks });
    // });
    console.log(filteredBooks);
    res.render("bookEdit.ejs", { filteredBooks });
  })
  .post((req, res) => {
    const book = req.params.BookName;
    // Book.findByIdAndUpdate(
    //   id,
    //   { Completed: req.body.Completed, CompletedDate: req.body.CompletedDate },
    //   (err) => {
    //     if (err) return res.send(500, err);
    //     res.redirect("/");
    //   }
    // );

    console.log(filteredBooks);

    // res.redirect("/");
  });

dotenv.config();

if (!process.env.PORT) process.exit(1);

const PORT = process.env.PORT || 7000;

const MongoUri = process.env.MONGO_URI || "";

if (MongoUri) {
  mongoose.connect(
    MongoUri,
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true },
    () => {
      console.log("Connected to db!");
      app.listen(PORT, () => {
        console.log(`Listening on port: ${PORT}`);
      });
    }
  );
}
