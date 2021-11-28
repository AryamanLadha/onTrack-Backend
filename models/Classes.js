import mongoose from "mongoose";
const { Schema } = mongoose;

const classesSchema = new Schema({
    fullName: String,
    shortName: String
})

classesSchema.statics.byFullName = (name) => {
    return this.where({ fullName: name });
}

classesSchema.statics.byShortName = (name) => {
    return this.where({ shortName: name });
}

const Classes = mongoose.model("Classes", classesSchema, "AllCourses");

export default Classes;