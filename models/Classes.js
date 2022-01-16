import mongoose from "mongoose";
const { Schema } = mongoose;

/* Classes are defined with mongoose to validate scheme between Express and MongoDB.
* each class contains a full name and a short name using the subject area 
* abbreviation and the class number/code, seperated by a space
*/
const classesSchema = new Schema({
  fullName: String,
  shortName: String,
});

// Static functions are used as helper functions to retrieve specifc documents from the database
classesSchema.statics.byFullName = (name) => {
  return this.where({ fullName: name });
};

classesSchema.statics.byShortName = (name) => {
  return this.where({ shortName: name });
};
// First argument is name of model, second is schema for model, third is name of collection storing the model.
const Classes = mongoose.model("Classes", classesSchema, "AllCourses");

export default Classes;
