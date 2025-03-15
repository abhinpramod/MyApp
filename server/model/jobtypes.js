const mongoose = require("mongoose");

const jobTypesSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    image: { type: String, required: true },
    imagepublicid: { type: String, require: true },
  },
  { timestamps: true }
);

const JobTypes = mongoose.model("JobTypes", jobTypesSchema);
module.exports = JobTypes;
