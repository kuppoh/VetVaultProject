const { promiseUserPool } = require('../config/database'); // A connection pool for the MySQL database
const passport = require("../middleware/passport");

let authController = {
  login: (req, res) => {
    res.render("auth/login", { role: 'user' });
  },

  register: (req, res) => {
    res.render("auth/register", { role: 'user' });
  },

  loginSubmit: passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/login",
  }),

  registerSubmit: async (req, res) => {
    const database = await promiseUserPool.query('SELECT * FROM users');
    try {
      const newUser = {
        id: database[0].length + 1,
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        role: "user"
      };
      console.log("Registering new user: ", newUser);
      await promiseUserPool.query('INSERT INTO users SET ?', newUser);
      res.redirect("/login");
    } catch (error) {
      console.error(error);
      res.redirect("/register");
    }
  },

  logout: (req, res) => {
    req.session.destroy(function(err) {
      if(err) {
        console.log(err);
      } else {
        res.redirect('/login');
      }
    });
  },
};

module.exports = authController;
