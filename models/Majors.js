import mongoose from "mongoose";
const { Schema } = mongoose;

// Majors schema and model, could possibly think of adding B.A/B.S. in the future
const majorsSchema = new Schema({
  name: String,
  // TODO: Fix this schema
  courses: Schema.Types.Mixed
});

majorsSchema.statics.byName = function (majorName) {
  return this.find({ name: majorName }, { _id: false });
};

const Majors = mongoose.model("Majors", majorsSchema, "Majors");

export default Majors;
