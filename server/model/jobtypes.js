const mongoose = require("mongoose");


const jobTypesSchema = new mongoose.Schema({
    name: { type: String, required: true },
    image: { type: String, required: true },
}, { timestamps: true });

const JobTypes = mongoose.model("JobTypes", jobTypesSchema);
module.exports = JobTypes;