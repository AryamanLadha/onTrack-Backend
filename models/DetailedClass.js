import mongoose from "mongoose";
const { Schema } = mongoose;

// Link to google docs documentation: https://docs.google.com/document/d/1xI37S21iuT8y78_eg1DViBFSYafCFuXF65Oq7Neu-w4/edit
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

// Helper functions to get specific documents from the database
DetailedClassSchema.statics.byName = function (name) {
  return this.where({ Name: name });
};

DetailedClassSchema.statics.bySubjectAreaAbbreviation = function (subjectArea) {
  return this.find({ "Subject Area Abbreviation": subjectArea });
};

// mongoDB query aggregation helper function that finds all eligible classes from the current quarter
DetailedClassSchema.statics.byClassesTaken = function (coursesToCheck, classesTaken) {
  return this.aggregate([
      //first stage: find all the eligible classes 
      {
        $match:{
          "Name": {$in:coursesToCheck},
          "Enforced Prerequisites":{$not:{$elemMatch:{$nin:classesTaken}}}
        }
      },
      //second stage: filter out classes already taken
      {
        $match:{"Name": {$nin: classesTaken}}
      },
      // third stage: organize output data by subject
      {
        $group:{
          _id: "$Subject Area Abbreviation",
          classes: {$push: "$Name", }
        }
      }
    ]);
};

// First argument is name of model, second is schema for model, third is name of collection storing the model.
const DetailedClass = mongoose.model(
  "CoursesOffered",
  DetailedClassSchema,
  "CoursesOffered"
);

export default DetailedClass;
