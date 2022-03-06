import Majors from "../models/Majors.js";
import DetailedClass from "../models/DetailedClass.js";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: "../.env" });

// Connect to database
mongoose
  .connect(process.env.DB_URI)
  .then(() => console.log("Connected to mongoDB"))
  .catch((err) => console.log(err));

DetailedClass.find({}).then((classes) => {
  for (let course in classes) {
    if (classes[course].subjectAreaAbbreviation.includes("&amp;")) {
      console.log(classes[course].subjectAreaAbbreviation);
      classes[course].subjectAreaAbbreviation = classes[
        course
      ].subjectAreaAbbreviation.replace("&amp;", "&");
      classes[course].save();
    }
    if (classes[course].name.includes("&amp;")) {
      console.log(classes[course].name);
      classes[course].name = classes[course].name.replace("&amp;", "&");
      classes[course].save();
    }
  }
});
