import express from "express";
import controller from "../controllers/auth.controller.js";
import passport from "passport";

const router = express.Router();

// Courses has getAll, getSingle, and getEligible options.

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  function (req, res) {
    //sucessfully authenticated, redirecting secrets.
    res.redirect("http://localhost:8000/api/auth/google/callback");
  }
);

router.get("/logout", function (req, res) {
  res.redirect("http://localhost:8000/api/auth/google/callback");
});
export default router;
