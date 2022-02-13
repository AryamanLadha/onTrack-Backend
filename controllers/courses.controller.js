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
  const completedClasses =
    data.completedClasses.length > 0
      ? data.completedClasses.reduce((a, v) => ({ ...a, [v]: 0 }), {})
      : {};
  const currentClasses =
    data.currentClasses.length > 0
      ? data.currentClasses.reduce((a, v) => ({ ...a, [v]: 0 }), {})
      : {};
  const eligibleClasses = [{ quarter: await currQuarter, subjects: {} }];

  for (const major of data.major) {
    /*  http://localhost:8000/api/courses/eligible/?studentData=
     * {"currentClasses":[],"completedClasses":["COM SCI 180", "MATH 32A", "MATH 32B", "MATH 61", "MATH 31B", "MATH 31A", "PHYSICS 1A"],"major":["COM SCI"]}
     */
    const majorData = await Majors.byName(major);
    const avaliableClasses =
      majorData.length === 0 ? {} : majorData[0].toObject().courses;

    for (const subject in avaliableClasses) {
      let coursesToCheck = [];
      for (const currentEntry of avaliableClasses[subject]) {
        /* If a range of classes is given, break the range into
         * individual classes and add them to the coursesToCheck array
         */
        if (currentEntry.includes("-")) {
          const possibleRange = (
            await DetailedClass.bySubjectAreaAbbreviation(subject)
          )
            .map((c) => c.toObject()["name"])
            .sort();
          let classNum = currentEntry.split("-").map((x) => subject + " " + x);

          for (const possibleEntry of possibleRange) {
            if (possibleEntry >= classNum[0] && possibleEntry < classNum[1]) {
              if (!coursesToCheck.includes(possibleEntry)) {
                coursesToCheck.push(possibleEntry);
              }
            } else if (possibleEntry > classNum[1]) {
              break;
            }
          }
        } else {
          coursesToCheck.push(subject + " " + currentEntry);
        }
      }
      for (const course of coursesToCheck) {
        let currCourse = await DetailedClass.byName(course);
        // Class not offered/found this quarter (invalid short name or missing from database)
        if (currCourse.length === 0) {
          // console.log(course + " not offered this quarter");
        } else {
          currCourse = currCourse[0];
          let addCourse = true;

          // Check if class is already completed or in progress
          if (
            completedClasses.hasOwnProperty(currCourse["name"]) ||
            currentClasses.hasOwnProperty(currCourse["name"])
          ) {
            addCourse = false;
          }
          for (const course of currCourse["enforcedPrerequisites"]) {
            if (!addCourse) {
              break;
            }
            if (!completedClasses.hasOwnProperty(course)) {
              addCourse = false;
              break;
            }
          }
          for (const course of currCourse["enforcedCorequisites"]) {
            if (!addCourse) {
              break;
            }
            if (
              !currentClasses.hasOwnProperty(course) &&
              !completedClasses.hasOwnProperty(course)
            ) {
              addCourse = false;
              break;
            }
          }

          if (addCourse) {
            const courseObj = {
              Name: currCourse["name"],
              Description: currCourse["description"],
              Units: currCourse["units"],
              enforcedCorequisites: currCourse["enforcedCorequisites"],
              Restrictions: currCourse["restrictions"],
            };

            if (eligibleClasses[0].subjects.hasOwnProperty(subject)) {
              eligibleClasses[0].subjects[subject].push(courseObj);
            } else {
              eligibleClasses[0].subjects[subject] = [courseObj];
            }
          }
        }
      }
    }
  }
  res.json(eligibleClasses);
};

export default controller;
