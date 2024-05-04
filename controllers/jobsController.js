const mongoose = require("mongoose");
const Job = require("../models/jobsModal.js");
const moment = require("moment");

const createJobController = async (req, res, next) => {
  try {
    const { company, position } = req.body;
    if (!company || !position) {
      return res.status(404).json({ message: "Please provide all fields" });
    }
    req.body.createdBy = req.user.userId;
    const job = await Job.create(req.body);
    res.status(200).json({ message: "Job Created", job });
  } catch (error) {
    next(error);
  }
};

const getAllJobsController = async (req, res, next) => {
  try {
    const { status, workType, search, sort } = req.query;
    const queryObject = { createdBy: req.user.userId };

    if (status && status !== "all") {
      queryObject.status = status;
    }

    if (workType && workType !== "all") {
      queryObject.workType = workType;
    }

    if (search) {
      queryObject.position = { $regex: search, $options: "i" };
    }

    let sortCriteria = {};
    switch (sort) {
      case "latest":
        sortCriteria = { createdAt: -1 }; // descending
        break;
      case "oldest":
        sortCriteria = { createdAt: 1 }; // ascending
        break;
      case "a-z":
        sortCriteria = { position: 1 }; // alphabetical (A-Z)
        break;
      case "z-a":
        sortCriteria = { position: -1 }; // reverse alphabetical (Z-A)
        break;
    }

    //Pagination
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    // Apply sorting and pagination to the Mongoose query
    const jobsQuery = Job.find(queryObject)
      .sort(sortCriteria) // Apply sorting
      .skip((page - 1) * limit) // Apply pagination
      .limit(limit); // Limit number of results per page

    const jobs = await jobsQuery;
    const totalJobs = await Job.countDocuments(jobsQuery); // Total count based on initial queryObject
    const numOfPages = Math.ceil(totalJobs / limit); // Calculate number of pages
    // const jobs = await Job.find({ createdBy: req.user.userId });
    if (!jobs) {
      return res
        .status(404)
        .json({ message: "No jobs found, maybe create one!" });
    }
    res.status(200).json({
      totalJobs,
      jobs,
      numOfPages,
    });
  } catch (error) {
    next(error);
  }
};

const updateJobController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { company, position } = req.body;
    if (!company || !position) {
      return res.status(404).json({ message: "Please provide all fields" });
    }
    const job = await Job.findById(id);
    if (!job) {
      return res.status(404).json({ message: "No job found" });
    }
    //Validate only the person created the job will only update
    if (!(req.user.userId === job.createdBy.toString())) {
      return res
        .status(404)
        .json({ message: "Not Authorized to update the job" });
    }
    const updateJob = await Job.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({ message: "Job Updated", updateJob });
  } catch (error) {
    next(error);
  }
};

const deleteJobController = async (req, res, next) => {
  try {
    const { id } = req.params;

    const job = await Job.findById(id);
    if (!job) {
      return res.status(400).json({ message: "No jobs found" });
    }
    //Validate only the person created the job will only update
    if (!(req.user.userId === job.createdBy.toString())) {
      return res
        .status(404)
        .json({ message: "Not Authorized to delete the job" });
    }

    // await Job.findByIdAndDelete(id);
    await job.deleteOne();

    res.status(200).json({ message: "Deleted job successffully" });
  } catch (error) {
    next(error);
  }
};

const jobsStatsController = async (req, res) => {
  const stats = await Job.aggregate([
    {
      $match: {
        createdBy: new mongoose.Types.ObjectId(req.user.userId),
      },
    },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);
  const defaultStats = {
    interview: stats.interview || 0,
    reject: stats.reject || 0,
    pending: stats.pending || 0,
  };

  let monthlyApplicaton = await Job.aggregate([
    {
      $match: {
        createdBy: new mongoose.Types.ObjectId(req.user.userId),
      },
    },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
        count: { $sum: 1 },
      },
    },
  ]);
  monthlyApplicaton = monthlyApplicaton
    .map((item) => {
      const {
        _id: { year, month },
        count,
      } = item;
      const date = moment()
        .month(month - 1)
        .year(year)
        .format("MMM Y");
      return { date, count };
    })
    .reverse();

  res
    .status(200)
    .json({ totalJobs: stats.length, defaultStats, monthlyApplicaton });
};

module.exports = {
  createJobController,
  getAllJobsController,
  updateJobController,
  deleteJobController,
  jobsStatsController,
};
