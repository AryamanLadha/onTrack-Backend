import express from "express";
import controller from "../controllers/courses.controller.js"
const router = express.Router();

router.get("/", controller.getAll);
router.get("/eligible", controller.getEligible);
router.get("/:course", controller.getSingle);


export default router;