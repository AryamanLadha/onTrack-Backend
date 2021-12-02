import Classes from "./../models/Classes.js"
import DetailedClass from "./../models/DetailedClass.js"
import Majors from '../models/Majors.js';

const controller = {};

controller.getAll = async (req, res) => {
    res.json((await Classes.find())[0].toObject().courses);
}

controller.getSingle = async (req, res) => {
    const data = await DetailedClass.byName(req.params.course);
    res.json(data.length === 0 ? {} : data[0].toObject());
}

controller.getEligible = async (req, res) => {
    const d = new Date();
    const quarter = (d.getMonth() + 1) >= 2 && (d.getMonth() + 1) <= 4 ? "Spring" :
        (d.getMonth() + 1) >= 5 && (d.getMonth() + 1) <= 6 ? "Summer" :
            (d.getMonth() + 1) >= 7 && (d.getMonth() + 1) <= 9 ? "Fall" : "Winter";
    const year = quarter === "Winter" ? d.getFullYear() + 1 : d.getFullYear();
    const currQuarter = quarter + " " + year;

    let data = {};
    try {
        data = JSON.parse(req.query.studentData);
    } catch {
        res.status(400).send("Invalid JSON");
        return;
    }

    if (!data.hasOwnProperty("completedClasses") || !data.hasOwnProperty("currentClasses")
        || !data.hasOwnProperty("major") || !Array.isArray(data["completedClasses"])
        || !Array.isArray(data["currentClasses"]) || !Array.isArray(data["major"])) {
        res.status(400).send("Invalid JSON");
        return;
    }

    const completedClasses = data.completedClasses.length > 0 ? data.completedClasses.reduce((a, v) => ({ ...a, [v]: 0 }), {}) : {};
    const currentClasses = data.currentClasses.length > 0 ? data.currentClasses.reduce((a, v) => ({ ...a, [v]: 0 }), {}) : {};
    const eligibleClasses = [{ "quarter": currQuarter, "subjects": {} }];

    for (const major in data.major) {
        /*  http://localhost:8000/api/courses/eligible/?studentData=
         * {"currentClasses":[],"completedClasses":["COM SCI 180", "MATH 32A", "MATH 32B", "MATH 61", "MATH 31B", "MATH 31A", "PHYSICS 1A"],"major":["COM SCI"]}
         */
        const majorData = await Majors.byName(data.major[major]);
        const avaliableClasses = (majorData.length === 0 ? {} : majorData[0].toObject().courses);
        for (const subject in avaliableClasses) {
            for (const currentEntry in avaliableClasses[subject]) {
                let coursesToCheck = [];

                if (avaliableClasses[subject][currentEntry].includes("-")) {
                    let classNum = avaliableClasses[subject][currentEntry].split(" ");
                    classNum = classNum[classNum.length - 1].split("-");
                    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from
                    const range = (start, stop, step) =>
                        Array.from({ length: (stop - start) / step + 1 }, (_, i) => subject + " " + (start + (i * step)));
                    coursesToCheck = range(parseInt(classNum[0]), parseInt(classNum[1]), 1);
                } else {
                    coursesToCheck = [avaliableClasses[subject][currentEntry]];
                }

                for (const course in coursesToCheck) {
                    let currCourse = await DetailedClass.byName(coursesToCheck[course]);
                    // Class not offered/found this quarter (invalid short name or missing from database)
                    if (currCourse.length === 0) {
                        // console.log(coursesToCheck[course] + " not offered this quarter");
                    } else {
                        currCourse = currCourse[0];
                        let addCourse = true;
                        // Check if class is already completed or in progress
                        if (completedClasses.hasOwnProperty(currCourse["Name"]) || currentClasses.hasOwnProperty(currCourse["Name"])) {
                            addCourse = false;
                        }
                        for (const course in currCourse["Enforced Prerequisites"]) {
                            if (!addCourse) {
                                break;
                            }
                            if (!completedClasses.hasOwnProperty(currCourse["Enforced Prerequisites"][course])) {
                                addCourse = false;
                                break;
                            }
                        }
                        for (const course in currCourse["Enforced Corequisites"]) {
                            if (!addCourse) {
                                break;
                            }
                            if (!currentClasses.hasOwnProperty(currCourse["Enforced Corequisites"][course]) && !completedClasses.hasOwnProperty(currCourse["Enforced Corequisites"][course])) {
                                addCourse = false;
                                break;
                            }
                        }

                        if (addCourse) {
                            if (eligibleClasses[0].subjects.hasOwnProperty(subject)) {
                                eligibleClasses[0].subjects[subject].push(currCourse["Name"]);
                            } else {
                                eligibleClasses[0].subjects[subject] = [currCourse["Name"]];
                            }
                        }
                    }
                }
            }
        }
    }
    res.json(eligibleClasses);
}

export default controller;
