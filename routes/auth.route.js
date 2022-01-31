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
  passport.authenticate("google", {
    failureRedirect: "/login",
  }),
  function (req, res) {
    // Sucessfully authenticated
    res.redirect("/");
  }
);

router.get("/logout", function (req, res) {
  req.session = null;
  req.logout();
  res.redirect("/");
});

router.get("/data", controller.getUserData);
router.put("/update", controller.updateUserData);
export default router;
