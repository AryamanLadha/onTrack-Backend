import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import routes from "./routes/index.js";
import helmet from "helmet";
import passport from "passport";
import googleOauth2 from "passport-google-oauth20";
import session from "express-session";
import User from "./models/Users.js";
import cookieSession from "cookie-session";
import morgan from "morgan";
import cors from "cors";

const app = express();
const port = process.env.PORT || 8000;
const GoogleStrategy = googleOauth2.Strategy;

dotenv.config();

//Configure Session Storage
app.use(
  cookieSession({
    name: "session-name",
    keys: [
      process.env.COOKIE_SESSION_SECRET1,
      process.env.COOKIE_SESSION_SECRET2,
    ],
  })
);

app.use(cors());

// Authentication configuration
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.EXPRESS_SECRET,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(function (req, res, next) {
  res.locals.user = req.user || null;
  next();
});
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

passport.serializeUser(function (user, done) {
  done(null, user.id);
});
passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

// Configure passport for user authentication with Google Oauth 2.0
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorizationURL: "https://accounts.google.com/o/oauth2/v2/auth",
      tokenURL: "https://www.googleapis.com/oauth2/v4/token",
      userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
      callbackURL: "http://localhost:8000/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      User.findOne(
        {
          googleId: profile.id,
        },
        function (err, user) {
          if (err) {
            return done(err);
          } else if (user) {
            return done(err, user);
          }

          // Create a new user if it does not exist
          user = new User({
            fullName: profile.displayName,
            googleId: profile.id,
            email: profile.emails[0].value,
            username: profile.id,
          });
          user.save(function (err) {
            if (err) console.log(err);
            return done(err, user);
          });
        }
      );
    }
  )
);

app.use(morgan("dev")); // Log every request to the console for debugging
app.use(helmet()); // Helmet adds http headers to boost security of express apps
app.use(express.json());
app.use("/api", routes); // Routes defined in routes/index.js

app.listen(port, () => {
  console.log(`App listening on port ${port}!`);
});
