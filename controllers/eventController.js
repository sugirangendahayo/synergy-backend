import db from "../configs/db.js";

 const createEvent = async (req, res) => {
  const {
    user_id,
    title,
    description,
    date,
    location,
    owner_id,
    cover,
    price,
  } = req.body;
  const query =
    "INSERT INTO Events (user_id, title, description, date, location, owner_id, cover, price) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

  try {
    const result = await db.query(query, [
      user_id,
      title,
      description,
      date,
      location,
      owner_id,
      cover,
      price,
    ]);
    res.status(201).json({
      message: "Event created successfully",
      eventId: result.insertId,
    });
  } catch (err) {
    res.status(500).json({ message: "Error creating event" });
  }
};

export default createEvent;