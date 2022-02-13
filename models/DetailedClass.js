import mongoose from "mongoose";
const { Schema } = mongoose;

// Link to google docs documentation: https://docs.google.com/document/d/1xI37S21iuT8y78_eg1DViBFSYafCFuXF65Oq7Neu-w4/edit
const DiscussionSchema = new Schema({
  Section: String,
  Instructor: String,
  Location: String,
  Time: String,
  Days: String,
});

const LectureSchema = new Schema({
  Section: String,
  Professor: String,
  Location: String,
  Time: String,
  Days: String,
  Discussions: [DiscussionSchema],
});
const DetailedClassSchema = new Schema({
  Name: String,
  "Subject Area": String,
  "Subject Area Abbreviation": String,
  "Quarters Offered": [String],
  Units: String,
  Lectures: [LectureSchema],
  "Enforced Prerequisites": [String],
  "Optional Prerequisites": [String],
  "Enforced Corequisites": [String],
  Description: String,
  Restrictions: String,
});

// Helper functions to get specific documents from the database
DetailedClassSchema.statics.byName = function (name) {
  return this.find({ Name: name }, { _id: false });
};

DetailedClassSchema.statics.bySubjectAreaAbbreviation = function (subjectArea) {
  return this.find({ "Subject Area Abbreviation": subjectArea });
};
// First argument is name of model, second is schema for model, third is name of collection storing the model.
const DetailedClass = mongoose.model(
  "CoursesOffered",
  DetailedClassSchema,
  "CoursesOffered"
);

export default DetailedClass;
