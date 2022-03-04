import DetailedClass from "../models/DetailedClass.js";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: "../.env" });

mongoose
  .connect(process.env.DB_URI)
  .then()
  .catch((err) => console.log(err));

await DetailedClass.updateMany(
  {},
  {
    $rename: {
      // "Subject Area": "subjectArea",
      // "Subject Area Abbreviation": "subjectAreaAbbreviation",
      // Name: "name",
      // Description: "description",
      // Restrictions: "restrictions",
      // "Enforced Prerequisites": "enforcedPrerequisites",
      // "Optional Prerequisites": "optionalPrerequisites",
      // "Enforced Corequisites": "enforcedCorequisites",
      // Units: "units",
      // "Quarters Offered": "quartersOffered",
      courseCode: "name",
    },
  },
  { multi: true },
  function (err) {
    if (err) {
      throw err;
    }
    console.log("Done!");
  }
).clone();

console.log("Finished Executing");

process.exit();
