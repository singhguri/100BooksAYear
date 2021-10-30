module.exports = (app, Book, userId) => {
  app.get("/books", async (req, res) => {
    const books = await Book.find({});

    books.filter((x) => {
      x.ReadStartDate = x.ReadStartDate.replace("T", " ");
      x.CompletedDate = x.CompletedDate.replace("T", " ");
    });
    res.render("book.ejs", { books });
  });

  app.post("/books", async (req, res) => {
    const book = new Book({
      BookName: req.body.BookName,
      Author: req.body.Author,
      ReadStartDate: req.body.ReadStartDate,
      Completed: req.body.Completed == "on" ? true : false,
      CompletedDate: req.body.CompletedDate
    });

    try {
      await book.save();
      res.redirect("/books");
    } catch (err) {
      console.error(err);
      res.redirect("/books");
    }
  });

  app
    .route("/books/edit/:id")
    .get((req, res) => {
      const book = Book.find({ _id: req.params.id }, (err, filteredBooks) => {
        if (filteredBooks[0].ReadStartDate.includes("Z"))
          filteredBooks[0].ReadStartDate =
            filteredBooks[0].ReadStartDate.split(".")[0];
        res.render("bookEdit.ejs", { filteredBooks });
      });
    })
    .post((req, res) => {
      const book = Book.find({ _id: req.params.id }, (err, filteredBooks) => {
        if (filteredBooks[0].ReadStartDate.includes("Z"))
          filteredBooks[0].ReadStartDate =
            filteredBooks[0].ReadStartDate.split(".")[0];

        // console.log(req.body, filteredBooks[0]);
        filteredBooks[0].Completed =
          req.body.Completed == "true" ? true : false;
        filteredBooks[0].CompletedDate = req.body.CompletedDate;

        Book.findByIdAndUpdate(req.params.id, filteredBooks[0], (err) => {
          if (err) return res.send(500, err);
        });
        res.redirect("/books");
      });
    });

  app.route("/books/remove/:id").get(async (req, res) => {
    try {
      await Book.findByIdAndRemove(req.params.id);
    } catch (err) {
      console.log(err);
    }
    res.redirect("/books");
  });
};
