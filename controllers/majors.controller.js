const controller = {};

controller.getAll = async (req, res) => {
    res.json({
        "majors": [
            {
                "name": "Mathematics",
                "abbreviation": "MATH",
                "subjects": ["test"]
            },
            {
                "name": "Physics",
                "abbreviation": "PHYSICS",
                "subjects": ["test"]
            },
            {
                "name": "Computer Science",
                "abbreviation": "COM SCI",
                "subjects": ["test"]
            },
            {
                "name": "Cognitive Science",
                "abbreviation": "COG SCI",
                "subjects": ["Computer Science", "Psychology"]
            }
        ]
    });
}

controller.getSingle = async (req, res) => {
    res.send("NOT IMPLEMENTED: get single major");
}

export default controller;