import mongoose from "mongoose";
const { Schema } = mongoose;

//classes are defined with mongoose to validate scheme between Express and MongoDB.
//each class contains a full name and a short name using the subject area abbreviation
const classesSchema = new Schema({
  fullName: String,
  shortName: String,
});
//static functions used as helper functions.
classesSchema.statics.byFullName = (name) => {
  return this.where({ fullName: name });
};

classesSchema.statics.byShortName = (name) => {
  return this.where({ shortName: name });
};
//first argument is name of model, second is schema for model, third is name of collection storing the model.
const Classes = mongoose.model("Classes", classesSchema, "AllCourses");

export default Classes;
