import mongoose from "mongoose";
const { Schema } = mongoose;

const majorsSchema = new Schema({
    name: String
})

majorsSchema.statics.byName = function (majorName) {
    return this.where({ name: majorName });
}

const Majors = mongoose.model("Majors", majorsSchema, "Majors");

export default Majors;
