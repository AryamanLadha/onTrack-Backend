const controller = {};

controller.getAll = async (req, res) => {
    res.json({
        "courses": [
            {
                "subject": "Computer Science",
                "abbreviation": "COM SCI",
                "number": "35L",
                "requisites": ["test"],
                "quarters": ["test"]
            },
            {
                "subject": "Computer Science",
                "abbreviation": "COM SCI",
                "number": "180",
                "requisites": ["test"],
                "quarters": ["test"]
            },
            {
                "subject": "Mathematics",
                "abbreviation": "MATH",
                "number": "31A",
                "requisites": ["test"],
                "quarters": ["test"]
            },
            {
                "subject": "Physics",
                "abbreviation": "PHYSICS",
                "number": "1C",
                "requisites": ["test"],
                "quarters": ["test"]
            },
            {
                "subject": "Psychology",
                "abbreviation": "PSYCH",
                "number": "85",
                "requisites": ["test"],
                "quarters": ["test"]
            }
        ]
    });
}

controller.getSingle = (req, res) => {
    res.send("NOT IMPLEMENTED: get single course");
}

controller.getEligible = async (req, res) => {
    res.send("NOT IMPLEMENTED: get eligible courses");
}

export default controller;