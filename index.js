import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import routes from "./routes/index.js";
import helmet from "helmet";

dotenv.config();

// connect to database
mongoose
  .connect(process.env.DB_URI)
  .then(() => console.log("Connected to mongoDB"))
  .catch((err) => console.log(err));
const app = express();
const port = process.env.PORT || 8000;

//fix CORS missing
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

//helmet adds http headers to boost security of express apps
app.use(helmet());

app.use(express.json());

//redirects to routes.index.js
app.use("/api", routes);

app.listen(port, () => {
  console.log(`App listening on port ${port}!`);
});
