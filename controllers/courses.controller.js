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
    // TODO: Get quarter instead of using this hardcoded value
    const currQuarter = "Winter 2021"
    let data = {};
    try {
        data = JSON.parse(req.query.studentData);
    } catch {
        res.status(400).send("Invalid JSON");
    }

    if (!data.hasOwnProperty("completedClasses") || !data.hasOwnProperty("currentClasses")) {
        res.status(400).send("Invalid JSON");
    }

    // TODO: get valid courses for major (using fake data for now)
    const avaliableClasses = {
        "Computer Science": ["COM SCI 180", "COM SCI 181", "COM SCI 31", "COM SCI 32", "COM SCI 33", "COM SCI 181"],
        "Physics": ["PHYSICS 4AL", "PHYSICS 1A", "PHYSICS 1B", "PHYSICS 1C"]
    }

    const completedClasses = data.completedClasses.length > 0 ? data.completedClasses.reduce((a, v) => ({ ...a, [v]: 0 }), {}) : {};
    console.log(completedClasses);
    const currentClasses = data.currentClasses.length > 0 ? data.currentClasses.reduce((a, v) => ({ ...a, [v]: 0 }), {}) : {};
    console.log(currentClasses);

    const eligibleClasses = [{ "quarter": currQuarter, "subjects": {} }];
    for (const subjects in avaliableClasses) {
        for (const course in avaliableClasses[subjects]) {
            let currCourse = await DetailedClass.byName(avaliableClasses[subjects][course]);
            // Class not found in database (invalid short name or missing from database)
            if (currCourse.length === 0) {
                // TODO: Handle this error. Class not avaliable for the quarter or it's just missing from DB.
                console.log("NOT FOUND/OFFERED THIS QUARTER: " + avaliableClasses[subjects][course]);
            } else {
                let addCourse = true;
                // Check if class is already completed or in progress
                if (completedClasses.hasOwnProperty(currCourse[0]["Name"]) || currentClasses.hasOwnProperty(currCourse[0]["Name"])) {
                    console.log("Already completed or in progress: " + currCourse[0]["Name"]);
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
    res.send(JSON.stringify(eligibleClasses));
}

export default controller;
