const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

module.exports = (app, User) => {
  const JWT_SECRET = process.env.JWT_SECRET;

  const Users = [
    {
      first_name: "Ram",
      last_name: "Sharma",
      Email: "ramsharma@gmail.com",
      Password: "ram",
    },
    {
      first_name: "Gurleen",
      last_name: "Kaur",
      Email: "gurleenkaur@gmail.com",
      Password: "gurleen",
    },
  ];

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

  const hashpassword = async (password, saltRounds = 10) => {
    try {
      const salt = await bcrypt.genSalt(saltRounds);

      return await bcrypt.hash(password, salt);
    } catch (error) {
      console.log(err);
    }

    return null;
  };

  const comparePassword = async (password, hash) => {
    try {
      return await bcrypt.compare(password, hash);
    } catch (error) {
      console.log(error);
    }

    return false;
  };

  // login
  app.post("/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      // const user = Users.filter((x) => x.Email === email)[0];
      const user = await User.find({ Email: email });

      if (!user)
        return res.status(401).json({
          respStatus: false,
          respMsg: "Please enter a valid username.",
        });

      const isPassValid = await comparePassword(password, user[0].Password);
      if (isPassValid) {
        const accessToken = jwt.sign({ email, id: user._id }, JWT_SECRET, {
          expiresIn: process.env.NODE_ENV === "production" ? "6h" : "2 days",
        });

        res
          .status(200)
          .json({ respStatus: true, respMsg: "User Logged in!", accessToken });
      } else {
        res
          .status(200)
          .json({ respStatus: false, respMsg: "Incorrect credentials" });
      }
    } catch (err) {
      console.log(err);
      res.status(503).json({ respStatus: false, respMsg: "Server Error!" });
    }
  });

  // register
  app.post("/register", async (req, res) => {
    try {
      const { first_name, last_name, email, password } = req.body;
      const hashedPass = await hashpassword(password);

      const newUser = new User({
        first_name,
        last_name,
        Email: email,
        Password: hashedPass,
      });

      await newUser.save();
      res.status(201).send({ respStatus: true, respMsg: User });
    } catch (err) {
      console.log(err);
      res.status(503).json({ respStatus: false, respMsg: err });
    }
  });

  // change password
  app.post("/updatePass", authenticateToken, async (req, res) => {
    try {
      const { email, password } = req.body;
      const hashPass = await hashpassword(password);

      const user = await User.find({ Email: email });
      const newUser = {
        ...user,
        Password: hashPass,
      };

      User.findByIdAndUpdate(user[0]._id, newUser, (err) => {
        if (err) return res.send(500).json({ respStatus: false, respMsg: err });
      });

      res
        .status(200)
        .json({ respStatus: true, respMsg: "Password updated successfully." });
    } catch (error) {
      console.log(error);
      res.send(500).json({ respStatus: false, respMsg: error });
    }
  });

  // deactivate user
  app.post("/deactivateUser", authenticateToken, async (req, res) => {
    try {
      const { email } = req.body;

      const user = await User.find({ Email: email });
      const newUser = {
        ...user,
        status: false,
      };

      User.findByIdAndUpdate(user[0]._id, newUser, (err) => {
        if (err) return res.send(500).json({ respStatus: false, respMsg: err });
      });

      res
        .status(200)
        .json({ respStatus: true, respMsg: "Account deactivated successfully." });

    } catch (error) {
      console.log(error);
      res.send(500).json({ respStatus: false, respMsg: error });
    }
  });
};
