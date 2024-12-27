import db from "../configs/db.js";

const createJob = async (req, res) => {
  const {
    title,
    description,
    job_type,
    location,
    owner_id,
    salary,
    requirements,
  } = req.body;
  const query =
    "INSERT INTO Job (title, description, job_type, location, owner_id, salary, requirements) VALUES (?, ?, ?, ?, ?, ?, ?)";

  try {
    const result = await db.query(query, [
      title,
      description,
      job_type,
      location,
      owner_id,
      salary,
      requirements,
    ]);
    res
      .status(201)
      .json({ message: "Job created successfully", jobId: result.insertId });
  } catch (err) {
    res.status(500).json({ message: "Error creating job" });
  }
};

const applyForJob = async (req, res) => {
  const { user_id, cover_letter, resume } = req.body; // User's application data
  const { jobId } = req.params; // Job ID from URL

  const query =
    "INSERT INTO Applications (user_id, job_id, cover_letter, resume) VALUES (?, ?, ?, ?)";

  try {
    await db.query(query, [user_id, jobId, cover_letter, resume]);
    res.status(201).json({ message: "Application submitted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error applying for job" });
  }
};


export { createJob, applyForJob };