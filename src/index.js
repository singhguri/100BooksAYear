const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

// Import db connection
require("./db/db");

const Book = require("./models/book");
const User = require("./models/user");

const app = express();

// app.use(express.urlencoded({ extended: true }));
app.use(bodyParser());

app.use(cors());

require("./routes/routes")(app, Book);
require("./routes/userRoutes")(app, User);

if (!process.env.PORT) process.exit(1);

const PORT = process.env.PORT || 7000;

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});

