const express = require("express");
const {
  createJobController,
  getAllJobsController,
  updateJobController,
  deleteJobController,
  jobsStatsController,
} = require("../controllers/jobsController.js");
const userAuth = require("../middlewares/authMiddleware.js");
const router = express.Router();

router.post("/create-job", userAuth, createJobController);

router.get("/get-jobs", userAuth, getAllJobsController);

router.patch("/update-job/:id", userAuth, updateJobController);

router.delete("/delete-job/:id", userAuth, deleteJobController);

router.get("/job-stats", userAuth, jobsStatsController);

module.exports = router;
