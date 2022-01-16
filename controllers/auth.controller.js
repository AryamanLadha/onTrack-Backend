import passport from "passport";

const controller = {};

controller.auth = async (req, res) => {
  console.log("trying to auth");
  passport.authenticate("google", { scope: ["profile", "email"] });
};

controller.authRedirect = async (req, res) => {
  // Redirects frontend to login page (this is NOT a backend api endpoint)
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
    // TODO: Figure out where this is supposed to redirect to
    function (req, res) {
      var token = req.user.token;
      res.redirect("http://localhost:3000?token=" + token);
    };
};

export default controller;
