import Majors from '../models/Majors.js';
const controller = {};

controller.getAll = async (req, res) => {
    res.json((await Majors.find({})).map(major => major.toObject().name).sort());
}

controller.getSingle = async (req, res) => {
    const data = await Majors.byName(req.params.major.toUpperCase());
    res.json(data.length === 0 ? {} : data[0].toObject());
}

export default controller;
