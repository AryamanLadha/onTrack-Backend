import express from "express";
import controller from "../controllers/auth.controller.js";
import passport from "passport";

const router = express.Router();

// authentication endpoint
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

//this is used from backend, nothing to do with frontend
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

//logout endpoint
router.get("/logout", function (req, res) {
  req.session = null;
  req.logout();
  res.redirect("/");
});

router.get("/data", controller.getUserData);
router.put("/update", controller.updateUserData);
export default router;
