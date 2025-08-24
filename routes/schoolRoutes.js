const express = require("express");
const router = express.Router();
const schoolController = require("../controllers/schoolController");

router.post("/", schoolController.addSchool);
router.get("/", schoolController.listSchools);
router.put("/:id", schoolController.updateSchool);
router.delete("/:id", schoolController.deleteSchool);

module.exports = router;
