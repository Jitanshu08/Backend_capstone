const express = require("express");
const router = express.Router();
const jobSchema = require("../schema/job.schema");

router.post("/", async (req, res, next) => {
  try {
    const jobInfo = req.body;
    const skills = jobInfo?.skills?.split(",") || [];
    const newSkills = skills?.map((skills) => skills?.trim());
    jobInfo.skills = newSkills;
    jobInfo.remote = jobInfo.remote === "true";
    const user = req.user;
    jobInfo.userID = user._id;
    const job = new jobSchema(jobInfo);
    job
      .save()
      .then(() => {
        res.status(201).json(job);
      })
      .catch((e) => {
        throw new Error(e.message);
      });
    // res.json(job).status(200);
  } catch (e) {
    next(e.message);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const job = await jobSchema.findById(id);
    if (!job) {
      return res.status(404).json({ message: "job not found" });
    }
    res.json(job);
  } catch (e) {
    next(e);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const job = await jobSchema.findById(id);
    if (!job) {
      return res.status(404).json({ message: "job not found" });
    }
    const jobCreator = job.userID.toString();
    const user = req.user._id.toString();
    if (jobCreator !== user) {
      return res
        .status(403)
        .json({ message: "you are not authorized to delete this job" });
    }
    await jobSchema.findByIdAndDelete(id);
    res.status(200).json({ message: "job deleted successfully" });
  } catch (e) {
    next(e);
  }
});

router.post("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const job = await jobSchema.findById(id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    const jobCreator = job.userID.toString();
    const user = req.user._id.toString();
    if (jobCreator !== user) {
      return res
        .status(403)
        .json({ message: "you are not authorized to update this job" });
    }
    const jobInfo = req.body;
    const skills = jobInfo?.skills?.split(",") || [];
    const newSkills = skills?.map((skills) => skills?.trim());
    jobInfo.skills = newSkills;
    jobInfo.remote = jobInfo.remote === "true";
    const updatedJob = await jobSchema.findById(id, jobInfo, {
      runValidators: true,
      new: true,
    });
    res.status(200).json(updatedJob);
  } catch (e) {
    next(e);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const { skills, keywords } = req.query; //skills filter or keywords filter
    const filter = {};
    if (skills) {
      const skillArray = skills.split(",").map((skills) => skills.trim());
      filter.skills = { $in: skillArray };
    }
    // if (keywords) {
    //   filter.title = { $search: keywords };
    // }
    const jobs = await jobSchema.find(filter);
    res.json(jobs);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
