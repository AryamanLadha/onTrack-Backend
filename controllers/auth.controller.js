import passport from "passport";
import User from "./../models/Users.js";

const controller = {};

controller.authGoogle = passport.authenticate("google", {
  scope: ["profile", "email"],
});

controller.authGoogleCallback = (req, res) => {
  // Change this to whatever the frontend url is
  const endpoint = req.user.isNewUser ? "majors" : "profile";
  res.redirect(`http://localhost:3000/${endpoint}`);
};

controller.logout = (req, res) => {
  req.session = null;
  req.logout();
  res.redirect("http://localhost:3000/");
};

controller.getUserData = async (req, res) => {
  const { user } = req;
  user ? res.json(user) : res.json({});
};

controller.updateUserData = async (req, res) => {
  const { user } = req;
  let { userData } = req.query;
  userData = JSON.parse(userData);

  userData.isNewUser = false;

  // Do not update user data if the user is not signed in
  if (!user) {
    return res.status(401).send("Unauthorized");
  }

  // Update user data based on ID
  User.findOneAndUpdate({ googleId: user.googleId }, userData, (err) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(userData);
    }
  });
};

export default controller;
