const mongoose = require("mongoose");

const jobsSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, "Company Name is Required"],
    },
    position: {
      type: String,
      required: [true, "Job Position is Required"],
      maxlength: 100,
    },
    status: {
      type: String,
      enum: ["pending", "reject", "interview"],
      default: "pending",
    },
    workType: {
      type: String,
      enum: ["full-time", "part-time", "internship", "contract"],
      default: "full-time",
    },
    workLocation: {
      type: String,
      default: "Mumbai",
      required: [true, "Work location is required"],
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", jobsSchema);
