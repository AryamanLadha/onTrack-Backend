import passport from "passport";

const controller = {};

controller.getData = async (req, res) => {
  req.user ? res.json(req.user) : res.json({});
};

export default controller;
