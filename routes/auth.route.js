import express from "express";
import controller from "../controllers/auth.controller.js";
import passport from "passport";

const router = express.Router();

// Authentication endpoint
router.get("/google", controller.authGoogle);

// This is used for backend, nothing to do with frontend
router.get("/google/callback", controller.authGoogleCallback);

router.get("/logout", controller.logout);
router.get("/data", controller.getUserData);
router.put("/update", controller.updateUserData);

export default router;
