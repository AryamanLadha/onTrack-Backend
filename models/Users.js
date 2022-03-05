import mongoose from "mongoose";
const { Schema } = mongoose;
import passportLocalMongoose from "passport-local-mongoose";
import findOrCreate from "mongoose-findorcreate";
// defined by quarter
const coursesTakenSchema = new Schema({
  quarter: { type: String, default: "" },
  courses: { type: [String], default: [] },
});

const userSchema = new Schema({
  email: { type: String, unique: true, require: true },
  googleId: { type: String, unique: true, require: true },
  fullName: { type: String, default: "", require: true },
  majors: { type: [String], default: [] },
  minors: { type: [String], default: [] },
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
  // Used to determine where to redirect user after login
  isNewUser: { type: Boolean, default: true },
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
//required plugins for creating users
userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

// First argument is name of model, second is schema for model, third is name of collection storing the model.
const User = new mongoose.model("User", userSchema, "Users");
export default User;
