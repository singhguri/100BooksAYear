const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Import db connection
require("./db/db");

const Book = require("./models/book");
const User = require("./models/user");

const app = express();

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

// Get UserId

// Login
app.post("/login", async (req, res) => {
  try {
    const { Email, Password } = req.body;

    if (!(Email && Password)) {
      // res.status(400).send("All input is required");
      return res.sendStatus(400);
    }

    const user = await User.findOne({ Email, status: true });

    if (user && (await bcrypt.compare(Password, user.Password))) {
      // Create token
      const token = jwt.sign(
        { user_id: user._id, Email },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h"
        }
      );

      // save user token
      user.token = token;

      res.render("main.ejs", { user });
    }
    res.sendStatus(400);
  } catch (err) {
    console.log(err);
  }
});

// Register
app.post("/register", async (req, res) => {
  const { first_name, last_name, Email, Password } = req.body;

  if (!(Email && Password && first_name)) {
    // res.status(400).send("All input is required");
    return res.sendStatus(400);
  }

  // check if user already exist
  // Validate if user exist in our database
  const oldUser = await User.findOne({ Email, status: true });

  if (oldUser) {
    // return res.status(409).send("User Already Exist. Please Login");
    return res.sendStatus(409);
  }

  encryptedPassword = await bcrypt.hash(Password, 10);

  const user = await User.create({
    Email: Email.toLowerCase(),
    Password: encryptedPassword
  });

  // Create token
  const token = jwt.sign({ user_id: user._id, Email }, process.env.TOKEN_KEY, {
    expiresIn: "2h"
  });

  // save user token
  user.token = token;
  user.save();

  res.redirect("/books");
});

const UserId = "";

require("./routes/bookRoutes")(app, Book, UserId);

dotenv.config();

if (!process.env.PORT) process.exit(1);

const PORT = process.env.PORT || 7000;

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
