const mongoose = require("mongoose");

const intrestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
   userId: { type: String, required: true },
   contractorId: { type: String, required: true },
   phoneNumber: { type: String, required: true },
   address: { type: String, required: true },
   expectedDate: { type: String, required: true },
   jobTypes: { type: [String], required: true },
   seenByContractor: { type: Boolean, default: false },
   contractorName: { type: String, required: true },
   contractorEmail: { type: String, required: true },
   companyName : { type: String, required: true },
  },
  { timestamps: true }
);

const Intrests = mongoose.model("Intrests", intrestSchema);
module.exports = Intrests;