import express from "express";
import controller from "../controllers/auth.controller.js";
import passport from "passport";

const router = express.Router();

// Courses has getAll, getSingle, and getEligible options.

router.post("/", passport.authenticate("google", {
    scope: ["profile", "email"],
    successRedirect: "/",
    failureRedirect: "/login"
}));

// router.get("/auth/redirect", controller.authRedirect);

export default router;
