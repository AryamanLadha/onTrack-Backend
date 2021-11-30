import Classes from "./../models/Classes.js"
import DetailedClass from "./../models/DetailedClass.js"

const controller = {};

controller.getAll = async (req, res) => {
    res.send((await Classes.find())[0].toObject().courses);
}

controller.getSingle = async (req, res) => {
    const data = await DetailedClass.byName(req.params.course);
    res.send(data.length === 0 ? {} : data[0].toObject());
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
        // TODO: get valid courses for data.majors[major] (using fake data for now)
        const avaliableClasses = {
            "Computer Science": ["COM SCI 180", "COM SCI 181", "COM SCI 31", "COM SCI 32", "COM SCI 33", "COM SCI 181"],
            "Physics": ["PHYSICS 4AL", "PHYSICS 1A", "PHYSICS 1B", "PHYSICS 1C"]
        }
        for (const subjects in avaliableClasses) {
            for (const course in avaliableClasses[subjects]) {
                let currCourse = await DetailedClass.byName(avaliableClasses[subjects][course]);
                // Class not found in database (invalid short name or missing from database)
                if (currCourse.length === 0) {
                    // console.log("NOT FOUND/OFFERED THIS QUARTER: " + avaliableClasses[subjects][course]);
                } else {
                    currCourse = currCourse[0];
                    let addCourse = true;
                    // Check if class is already completed or in progress
                    if (completedClasses.hasOwnProperty(currCourse["Name"]) || currentClasses.hasOwnProperty(currCourse["Name"])) {
                        // console.log("Already completed or in progress: " + currCourse["Name"]);
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
                        if (eligibleClasses[0].subjects.hasOwnProperty(subjects)) {
                            eligibleClasses[0].subjects[subjects].push(currCourse["Name"]);
                        } else {
                            eligibleClasses[0].subjects[subjects] = [currCourse["Name"]];
                        }
                    }
                }
            }
        }
    }
    res.send(JSON.stringify(eligibleClasses));
}

export default controller;
