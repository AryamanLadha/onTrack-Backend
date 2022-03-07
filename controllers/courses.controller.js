import Classes from "./../models/Classes.js";
import DetailedClass from "./../models/DetailedClass.js";
import Majors from "../models/Majors.js";

const controller = {};

/* Retrieves all documents in Classes model.
 * Returns the array containing all courses
 */
controller.getAll = async (req, res) => {
  res.json(await Classes.find({}, { _id: false }));
};

// Retrieves a single course by short name
controller.getSingle = async (req, res) => {
  const data = await DetailedClass.byName(req.params.course);
  res.json(data.length === 0 ? {} : data[0].toObject());
};

// Retrieve all eligible courses based on previous classes and reqs in different subject areas from DARS.
controller.getEligible = async (req, res) => {
  // Check if user is logged in
  if (!req.user) {
    return res.status(401).send("Unauthorized");
  }

  const currQuarter = (async () => {
    // TODO: Test and implement the date functionality correctly
    const d = new Date();
    const quarter =
      d.getMonth() + 1 >= 2 && d.getMonth() + 1 <= 4
        ? "Spring"
        : d.getMonth() + 1 >= 5 && d.getMonth() + 1 <= 6
        ? "Summer"
        : d.getMonth() + 1 >= 7 && d.getMonth() + 1 <= 9
        ? "Fall"
        : "Winter";
    const year = quarter === "Winter" ? d.getFullYear() + 1 : d.getFullYear();
    return quarter + " " + year;
  })();

  //get student data from URL query
  let data = {};
  try {
    data = JSON.parse(req.query.studentData);
  } catch {
    res.status(400).send("Invalid JSON");
    return;
  }

  // Check if input data is valid, (can be deleted after we begin saving student data)
  if (
    !data.hasOwnProperty("completedClasses") ||
    !data.hasOwnProperty("currentClasses") ||
    !data.hasOwnProperty("major") ||
    !Array.isArray(data["completedClasses"]) ||
    !Array.isArray(data["currentClasses"]) ||
    !Array.isArray(data["major"])
  ) {
    res.status(400).send("Invalid JSON");
    return;
  }
  /* For the student's completed and current classes, rearrange the data as an object with
   * the short name as the key (value is set to 0) for constant time access when searching
   * for the preqs. (all code below will change once we begin storing user data or implement GraphQL)
   */

  let eligibleClasses = [{ quarter: await currQuarter, subjects: {} }];

  const coursesToCheck = [];

  // Add all classes for each major to the coursesToCheck array
  for (const major of data.major) {
    /*  http://localhost:8000/api/courses/eligible/?studentData=
     * {"currentClasses":[],"completedClasses":["COM SCI 180", "MATH 32A", "MATH 32B", "MATH 61", "MATH 31B", "MATH 31A", "PHYSICS 1A"],"major":["COM SCI"]}
     */
    const majorData = await Majors.byName(major);
    const avaliableClasses =
      majorData.length === 0 ? {} : majorData[0].toObject().courses;

    /* Loop through each subject under the major's courses
     * and add all the classes to the coursesToCheck array
     * with the shortname "subjectArea classNumber"
     */
    for (const subject in avaliableClasses) {
      for (const currentEntry of avaliableClasses[subject]) {
        coursesToCheck.push(subject + " " + currentEntry);
      }
    }
  }

  // Using mongodb query operation to filter out all the eligible classes
  if (data.completedClasses.length >= 1) {
    let eligible = await DetailedClass.byClassesTaken(
      coursesToCheck,
      data.completedClasses
    );

    /* Reformat eligbleClasses subjects to be an object containing
     * subjectArea as the key and an array of classe objects as the value
     */
    let temp = {};
    for (let i = 0; i < eligible.length; i++) {
      temp[eligible[i].subject] = eligible[i].classes;
    }

    eligibleClasses[0].subjects = temp;
  }

  res.json(eligibleClasses);
};

export default controller;
