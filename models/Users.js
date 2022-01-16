import mongoose from "mongoose";
const { Schema } = mongoose;

// defined by quarter
const coursesTakenSchema = new Schema({
  quarter: { type: String, default: "" },
  courses: [String],
});
const userSchema = new Schema({
  email: String,
  googleId: String,
  secret: String,
  fullName: { type: String, default: "" },
  majors: [String],
  dates: {
    quarterEntered: { type: String, default: "" },
    quarterExpectedGraduation: { type: String, default: "" },
  },
  //which year did they enter as
  enteredAs: { type: String, default: "" },
  //currently in which year level
  currentYear: { type: String, default: "" },
  // date of account creation, useful for aggregating data for statistics
  accountDate: { type: Date, default: Date.now },
  // uses schema defined above
  coursesTaken: [coursesTakenSchema],
});

// get user by email
userSchema.statics.findByEmail = (email) => {
  return this.find({ email: email });
};
//get users by major
userSchema.statics.findByMajor = (major) => {
  return this.find({ major: major });
};

//get users by major and year
userSchema.statics.findByMajorAndYear = (major, year) => {
  return this.find({ major: major, currentYear: year });
};
// First argument is name of model, second is schema for model, third is name of collection storing the model.
const User = new mongoose.model("User", userSchema, "Users");
export default User;