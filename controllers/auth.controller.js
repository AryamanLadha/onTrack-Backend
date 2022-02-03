import passport from "passport";
import User from "./../models/Users.js";

const controller = {};

controller.getUserData = async (req, res) => {
  const { user } = req;
  user ? res.json(user) : res.json({});
};

controller.updateUserData = async (req, res) => {
  const { user } = req;
  // const userData = { majors: ["bruh", "test"] }
  const { userData } = req.params;

  // Check if the user is signed in
  if (user) {
    //function to update user data based on ID
    User.findOneAndUpdate({ googleId: user.googleId }, userData, (err) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(200).send(userData);
      }
      // err ? console.log(err) : console.log("Successfully updated user data")
    });
  } else {
    return res.status(401).send("Unauthorized");
  }
};

export default controller;
