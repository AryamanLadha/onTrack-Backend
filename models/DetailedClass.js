import mongoose from "mongoose";
const { Schema } = mongoose;

// Link to google docs documentation: https://docs.google.com/document/d/1xI37S21iuT8y78_eg1DViBFSYafCFuXF65Oq7Neu-w4/edit
const DiscussionSchema = new Schema({
  section: String,
  instructor: String,
  location: String,
  time: String,
  days: String,
});

const LectureSchema = new Schema({
  section: String,
  professor: String,
  location: String,
  time: String,
  days: String,
  discussions: [DiscussionSchema],
});
const DetailedClassSchema = new Schema({
  name: String,
  longName: String,
  subjectArea: String,
  subjectAreaAbbreviation: String,
  quartersOffered: [String],
  units: String,
  lectures: [LectureSchema],
  enforcedPrerequisites: [[String]],
  enforcedCorequisites: [[String]],
  description: String,
  restrictions: String,
});

// Helper functions to get specific documents from the database
DetailedClassSchema.statics.byName = function (name) {
  return this.find({ name: name }, { _id: false });
};

DetailedClassSchema.statics.bySubjectAreaAbbreviation = function (subjectArea) {
  return this.find({ subjectAreaAbbreviation: subjectArea });
};

// Helper function to find eligibleClasses: mongoDB aggregate
DetailedClassSchema.statics.byClassesTaken = function (
  coursesToCheck,
  classesTaken
) {
  return this.aggregate([
    // First stage: find all the eligible classes
    {
      $match: {
        name: { $in: coursesToCheck },
        enforcedPrerequisites: {
          $not: { $elemMatch: { $elemMatch: { $nin: classesTaken } } },
        },
      },
    },
    // Second stage: filter out classes already taken
    {
      $match: { name: { $nin: classesTaken } },
    },
    // Third stage: organize output data by subject
    {
      $group: {
        _id: "$subjectAreaAbbreviation",
        classes: {
          $push: {
            name: "$name",
            longName: "$longName",
            description: "$description",
            units: "$units",
            enforcedCorequisites: "$enforcedCorequisites",
            restrictions: "$restrictions",
          },
        },
      },
    },
    // Fourth stage: renaming
    {
      $project: {
        _id: 0,
        subject: "$_id",
        classes: 1,
      },
    },
  ]);
};

// First argument is name of model, second is schema for model, third is name of collection storing the model.
const DetailedClass = mongoose.model(
  "CoursesOffered",
  DetailedClassSchema,
  "CoursesOfferedS22"
);

export default DetailedClass;
