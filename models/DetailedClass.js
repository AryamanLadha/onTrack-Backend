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

DetailedClassSchema.query.byQuartersOffered = function (quartersOffered) {
    return this.where({ "Quarters Offered": quartersOffered });
}

DetailedClassSchema.query.byRestrictions = function (restrictions) {
    return this.where({ "Restrictions": restrictions });
}

DetailedClassSchema.query.byUnits = function (units) {
    return this.where({ "Units": units });
}

DetailedClassSchema.query.bySubjectAreaAbbreviation = function (subjectAreaAbbreviation) {
    return this.where({ "Subject Area Abbreviation": subjectAreaAbbreviation });
}

DetailedClassSchema.query.byEnforcedPrerequisites = function (enforcedPrerequisites) {
    return this.where({ "Enforced Prerequisites": enforcedPrerequisites });
}

DetailedClassSchema.query.byOptionalPrerequisites = function (optionalPrerequisites) {
    return this.where({ "Optional Prerequisites": optionalPrerequisites });
}

DetailedClassSchema.query.byEnforcedCorequisites = function (enforcedCorequisites) {
    return this.where({ "Enforced Corequisites": enforcedCorequisites });
}

DetailedClassSchema.query.byPrerequisites = function (prerequisites) {
    return this.where({ "Enforced Prerequisites": prerequisites, "Optional Prerequisites": prerequisites, "Enforced Corequisites": prerequisites });
}

const DetailedClass = mongoose.model("CoursesOffered", DetailedClassSchema, "CoursesOffered");

export default DetailedClass;
