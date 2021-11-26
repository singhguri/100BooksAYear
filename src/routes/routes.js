module.exports = (app, Book) => {
  // get all books
  app.get("/book/all", async (req, res) => {
    try {
      const books = await Book.find({});

      books.filter((x) => {
        x.ReadStartDate = x.ReadStartDate.replace("T", " ");
        x.CompletedDate = x.CompletedDate.replace("T", " ");
      });

      res.status(200).json({ respStatus: true, respMsg: books });
    } catch (err) {
      res.status(500).json({ respStatus: false, respMsg: err });
    }
  });

  // add book
  app.post("/book/add", async (req, res) => {
    const book = new Book({
      BookName: req.body.BookName,
      Author: req.body.Author,
      ReadStartDate: req.body.ReadStartDate,
      Completed: req.body.Completed == "on" ? true : false,
      CompletedDate: req.body.CompletedDate,
    });

    try {
      await book.save();
      res.status(201).send({ respStatus: true, respMsg: book });
    } catch (err) {
      console.error(err);
      res.status(500).json({ respStatus: false, respMsg: err });
    }
  });

  // get book by id
  app.get("/book/:id", async (req, res) => {
    try {
      const book = await Book.find({ _id: req.params.id });
      res.status(200).json({ respStatus: true, respMsg: book });
    } catch (err) {
      res.status(500).json({ respStatus: false, respMsg: err });
    }
  });

  // update a book
  app.route("/book/edit/:id").get(async (req, res) => {
    try {
      await Book.findByIdAndUpdate(req.params.id, req.body, (err) => {
        if (err) return res.send(500).json({ respStatus: false, respMsg: err });
      });
      res
        .status(200)
        .json({ respStatus: true, respMsg: "Book updated successfully." });
    } catch (error) {
      res.status(500).json({ respStatus: false, respMsg: error });
    }
  });

  // delete a book
  app.route("/book/remove/:id").get(async (req, res) => {
    try {
      await Book.findByIdAndRemove(req.params.id);
    } catch (err) {
      console.log(err);
      res.status(500).json({ respStatus: false, respMsg: err });
    }
    res
      .status(204)
      .json({ respStatus: true, respMsg: "Book removed successfully." });
  });
};
