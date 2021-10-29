const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

// Import db connection
require("./db/db");

const Book = require("./models/book");

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

require("./routes/routes")(app, Book);

dotenv.config();

if (!process.env.PORT) process.exit(1);

const PORT = process.env.PORT || 7000;

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
