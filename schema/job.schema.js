const mongoose = require("mongoose");
const jobSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true,
  },
  logoURL: {
    type: String,
    required: true,
  },
  jobPosition: {
    type: String,
    required: true,
  },
  monthlySalary: {
    type: Number,
    required: true,
  },
  jobType: {
    type: String,
    enum: ["Full-time", "Part-time", "Contract", "Freelance"],
    default: "Full-time",
  },
  remote: {
    type: Boolean,
    enum: ["Yes", "No"],
    default: "No",
  },
  Location: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  about: {
    type: String,
    required: true,
  },
  skills: {
    type: Array,
    required: true,
  },
  information: {
    type: String,
    required: true,
  },
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Job", jobSchema);