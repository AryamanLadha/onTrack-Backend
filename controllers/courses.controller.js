import mongoose from "mongoose";
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
    res.send("NOT IMPLEMENTED: get eligible courses");
}

export default controller;
