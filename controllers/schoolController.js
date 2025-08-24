const Joi = require("joi");
const db = require("../config/db");

const schoolSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  address: Joi.string().allow("").max(255),
  latitude: Joi.number().precision(6).required(),
  longitude: Joi.number().precision(6).required(),
});
const locationSchema = Joi.object({
  latitude: Joi.number().precision(6).required(),
  longitude: Joi.number().precision(6).required(),
});

exports.addSchool = (req, res) => {
  const { error, value } = schoolSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const { name, address, latitude, longitude } = value;

  const std = "INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)";
  db.query(std, [name, address, latitude, longitude], (err, result) => {
    if (err) {
      console.error("❌ DB Error:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.status(201).json({ message: "School created successfully", schoolId: result.insertId });
  });
};

exports.listSchools = (req, res) => {
  const { error, value } = locationSchema.validate(req.query);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const { latitude, longitude } = value;

  const std = `
    SELECT *, 
    (6371 * acos(
      cos(radians(?)) * cos(radians(latitude)) *
      cos(radians(longitude) - radians(?)) +
      sin(radians(?)) * sin(radians(latitude))
    )) AS distance
    FROM schools
    ORDER BY distance ASC
  `;

  db.query(std, [latitude, longitude, latitude], (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });

    res.json({
      message: "Schools sorted by nearest distance",
      location: { latitude, longitude },
      data: results,
    });
  });
};

exports.updateSchool = (req, res) => {
  const { id, name } = req.body;

  if (!id) {
    return res.status(400).json({ error: "School ID is required" });
  }
  if (!name) {
    return res.status(400).json({ error: "School name is required" });
  }

  const std = `UPDATE schools SET name = ? WHERE id = ?`;

  db.query(std, [name, id], (err, result) => {
    if (err) {
      console.error("❌ DB Error:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "No school found with that ID" });
    }

    res.json({ message: "✅ School updated successfully!" });
  });
};

exports.deleteSchool = (req, res) => {
  console.log(req.params)
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: "School ID is required" });
  }

  const sql = "DELETE FROM schools WHERE id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: "Database error" });

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "School not found" });
    }
    res.json({ message: "School deleted successfully" });
  });
};

