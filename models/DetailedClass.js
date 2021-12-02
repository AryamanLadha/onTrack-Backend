import mongoose from "mongoose";
const { Schema } = mongoose;

const DetailedClassSchema = new Schema({
    "Name": String,
    "Subject Area": String,
    "Subject Area Abbreviation": String,
    "Quarters Offered": [String],
    "Units": String,
    "Enforced Prerequisites": [String],
    "Optional Prerequisites": [String],
    "Enforced Corequisites": [String],
    "Description": String,
    "Restrictions": String
})

DetailedClassSchema.statics.byName = function (name) {
    return this.where({ Name: name });
}

DetailedClassSchema.statics.bySubjectAreaAbbreviation = function (subjectArea) {
    return this.find({ "Subject Area Abbreviation": subjectArea });
}

const DetailedClass = mongoose.model("CoursesOffered", DetailedClassSchema, "CoursesOffered");

export default DetailedClass;
