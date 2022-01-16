import Majors from "../models/Majors.js";
const controller = {};

//fetch from mongoDB, .find() returns all documents, retrieve and sort all names of majors, converts to json string via .json and sends json response.
controller.getAll = async (req, res) => {
  res.json((await Majors.find()).map((major) => major.toObject().name).sort());
};

// retrieves single major by name, checks if major exists, return major info if it does, otherwise empty object.
controller.getSingle = async (req, res) => {
  const data = await Majors.byName(req.params.major.toUpperCase());
  res.json(data.length === 0 ? {} : data[0].toObject());
};

export default controller;
