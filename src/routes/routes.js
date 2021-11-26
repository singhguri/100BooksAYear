const jwt = require("jsonwebtoken");

module.exports = (app, Book) => {
  const JWT_SECRET = process.env.JWT_SECRET;

  const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (token === null)
      return res
        .status(401)
        .json({ respStatus: false, respMsg: "Not Authorized" });

    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) return res.status(401).json({ respStatus: false, respMsg: err });
      req.user = user;
      next();
    });
  };

  // get all books
  app.get("/book/all", authenticateToken, async (req, res) => {
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
  app.post("/book/add", authenticateToken, async (req, res) => {
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
  app.get("/book/:id", authenticateToken, async (req, res) => {
    try {
      const book = await Book.find({ _id: req.params.id });
      res.status(200).json({ respStatus: true, respMsg: book });
    } catch (err) {
      res.status(500).json({ respStatus: false, respMsg: err });
    }
  });

  // update a book
  app.post("/book/edit/:id", authenticateToken, async (req, res) => {
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
  app.get("/book/remove/:id", authenticateToken, async (req, res) => {
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
