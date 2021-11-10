import express from "express";
import controller from "../controllers/majors.controller.js"
const router = express.Router();

router.get("/", controller.getAll);
router.get("/:major", controller.getSingle);

export default router;