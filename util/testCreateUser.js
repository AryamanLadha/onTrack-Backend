import User from "../models/Users.js";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: "../.env" });

// Connect to database
mongoose
  .connect(process.env.DB_URI)
  .then(() => console.log("Connected to mongoDB"))
  .catch((err) => console.log(err));

const profile = {
  id: "456788656345678765",
  displayName: "Johnnny Doe",
  emails: [{ value: "jdoee@g.ucla.edu" }],
};

User.findOne(
  {
    googleId: profile.id,
  },
  function (err, user) {
    if (err) {
      console.log(err);
      return;
    } else if (user) {
      console.log("User already exists");
      return;
    }

    console.log("Creating new user");

    // Create a new user if it does not exist
    user = new User({
      fullName: profile.displayName,
      googleId: profile.id,
      email: profile.emails[0].value,
    });
    user.save(function (err) {
      if (!err) {
        console.log("New user created");
      }
    });
  }
);
