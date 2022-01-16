import express from "express";
import controller from "../controllers/courses.controller.js";
const router = express.Router();

// courses has getAll, getSingle, and getEligible options.
router.get("/", controller.getAll);
router.get("/eligible", controller.getEligible);
router.get("/:course", controller.getSingle);

export default router;
