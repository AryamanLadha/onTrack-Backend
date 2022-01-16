import mongoose from "mongoose";
const { Schema } = mongoose;

// Majors schema and model, could possibly think of adding B.A/B.S. in the future
const majorsSchema = new Schema({
  name: String,
});

majorsSchema.statics.byName = function (majorName) {
  return this.where({ name: majorName });
};

const Majors = mongoose.model("Majors", majorsSchema, "Majors");

export default Majors;
