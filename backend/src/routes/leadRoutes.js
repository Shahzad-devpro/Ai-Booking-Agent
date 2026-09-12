const express = require("express");
const { createLead, getAllLeads, getLeadById, updateLeadStatus } = require("../controllers/leadController");
const { validLeadStatus, validateCreateLead } = require("../validators/leadValidator");
const { validateLeadQuery } = require("../validators/queryValidator");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


router.post("/", validateCreateLead, createLead);
router.get("/", authMiddleware, validateLeadQuery, getAllLeads);
router.get("/:id",getLeadById);
router.patch("/:id/status", validLeadStatus, updateLeadStatus);


module.exports = router;