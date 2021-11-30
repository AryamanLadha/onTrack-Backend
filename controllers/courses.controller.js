import Classes from "./../models/Classes.js"
import DetailedClass from "./../models/DetailedClass.js"

const controller = {};

controller.getAll = async (req, res) => {
    res.send(await Classes.find());
}

controller.getSingle = async (req, res) => {
    res.send(await DetailedClass.byName(req.params.course));
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
                    let addCourse = true;
                    // Check if class is already completed or in progress
                    if (completedClasses.hasOwnProperty(currCourse[0]["Name"]) || currentClasses.hasOwnProperty(currCourse[0]["Name"])) {
                        // console.log("Already completed or in progress: " + currCourse[0]["Name"]);
                        addCourse = false;
                    }
                    for (const course in currCourse[0]["Enforced Prerequisites"]) {
                        if (!addCourse) {
                            break;
                        }
                        if (!completedClasses.hasOwnProperty(currCourse[0]["Enforced Prerequisites"][course])) {
                            addCourse = false;
                            break;
                        }
                    }
                    for (const course in currCourse[0]["Enforced Corequisites"]) {
                        if (!addCourse) {
                            break;
                        }
                        if (!currentClasses.hasOwnProperty(currCourse[0]["Enforced Corequisites"][course]) && !completedClasses.hasOwnProperty(currCourse[0]["Enforced Corequisites"][course])) {
                            addCourse = false;
                            break;
                        }
                    }

                    if (addCourse) {
                        if (eligibleClasses[0].subjects.hasOwnProperty(subjects)) {
                            eligibleClasses[0].subjects[subjects].push(currCourse[0]["Name"]);
                        } else {
                            eligibleClasses[0].subjects[subjects] = [currCourse[0]["Name"]];
                        }
                    }
                }
            }
        }
    }
    res.send(JSON.stringify(eligibleClasses));
}

export default controller;
