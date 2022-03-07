import passport from "passport";
import User from "./../models/Users.js";

const controller = {};

controller.authGoogle = passport.authenticate("google", {
  scope: ["profile", "email"],
});

// Callback to redirect on successful authentication
controller.authGoogleCallback = (req, res) => {
  // Change this to whatever the frontend url is
  const endpoint = req.user.isNewUser ? "majors" : "profile";
  res.redirect(process.env.FRONT_END_URL + endpoint);
};

// Clear session on logout
controller.logout = (req, res) => {
  req.session = null;
  req.logout();
  res.redirect(process.env.FRONT_END_URL);
};

// Return user data
controller.getUserData = async (req, res) => {
  // Check if user is logged in
  if (!req.user) {
    return res.status(401).send("Unauthorized");
  }

  return res.json(req.user);
};

// Endpoint to update user data
controller.updateUserData = async (req, res) => {
  const { user } = req;
  let userData = req.body;
  userData.isNewUser = false;

  // Do not update user data if the user is not signed in
  if (!user) {
    return res.status(401).send("Unauthorized");
  }

  // Update user data based on ID
  User.findOneAndUpdate({ googleId: user.googleId }, userData, (err) => {
    if (err) {
      return res.status(500).send(err);
    } else {
      return res.status(200).send(userData);
    }
  });
};

export default controller;
