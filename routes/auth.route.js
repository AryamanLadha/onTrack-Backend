import express from "express";
import controller from "../controllers/auth.controller.js";
import passport from "passport";

const router = express.Router();

// Courses has getAll, getSingle, and getEligible options.

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile"],
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
  }),
  function (req, res) {
    //sucessfully authenticated, redirecting secrets.
    res.redirect("/callback");
  }
);

router.get("/logout", function (req, res) {
  res.redirect("/callback");
});
export default router;
