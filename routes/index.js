import express from "express";
const router = express.Router();

import courses from "./courses.route.js";
import majors from "./majors.route.js";
import auth from "./auth.route.js";

// Splits routes into courses and majors
router.use("/courses", courses);
router.use("/majors", majors);
router.use("/auth", auth);

export default router;
