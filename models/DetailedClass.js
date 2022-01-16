import mongoose from "mongoose";
const { Schema } = mongoose;

//link to google docs documentation: https://docs.google.com/document/d/1xI37S21iuT8y78_eg1DViBFSYafCFuXF65Oq7Neu-w4/edit
const DetailedClassSchema = new Schema({
  Name: String,
  "Subject Area": String,
  "Subject Area Abbreviation": String,
  "Quarters Offered": [String],
  Units: String,
  "Enforced Prerequisites": [String],
  "Optional Prerequisites": [String],
  "Enforced Corequisites": [String],
  Description: String,
  Restrictions: String,
});
//helper functions
DetailedClassSchema.statics.byName = function (name) {
  return this.where({ Name: name });
};

DetailedClassSchema.statics.bySubjectAreaAbbreviation = function (subjectArea) {
  return this.find({ "Subject Area Abbreviation": subjectArea });
};
//first argument is name of model, second is schema for model, third is name of collection storing the model.
const DetailedClass = mongoose.model(
  "CoursesOffered",
  DetailedClassSchema,
  "CoursesOffered"
);

export default DetailedClass;
