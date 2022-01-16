import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import routes from "./routes/index.js";
import helmet from "helmet";
import passport from "passport";
import oauth2 from "passport-openid-oauth20"
import session from "express-session";

const app = express();
const port = process.env.PORT || 8000;
const OpenIdOAuth2Strategy = oauth2.Strategy;

dotenv.config();

// Connect to database
mongoose
  .connect(process.env.DB_URI)
  .then(() => console.log("Connected to mongoDB"))
  .catch((err) => console.log(err));

// Fix CORS missing
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(helmet()); // Helmet adds http headers to boost security of express apps
app.use(express.json());
app.use("/api", routes); // Routes defined in routes/index.js

// Authentication configuration
app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: 'super secret password that i definitely will remember to change'
}));

app.use(passport.initialize());
app.use(passport.session());

// Configure passport for user authentication with Google Oauth 2.0
passport.use("google", new OpenIdOAuth2Strategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  authorizationURL: "https://accounts.google.com/o/oauth2/v2/auth",
  tokenURL: "https://www.googleapis.com/oauth2/v4/token",
  userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
  callbackURL: "http://localhost:8000/api/auth/",
}, function (request, accessToken, refreshToken, profile, done) {
  // TODO: Create user in DB (also do the checking for if they exist)
  return done(null, user);
}));


app.listen(port, () => {
  console.log(`App listening on port ${port}!`);
});
