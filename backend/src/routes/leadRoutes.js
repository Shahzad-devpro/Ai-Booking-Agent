const express = require("express");
const { createLead, getAllLeads, getLeadById, updateLeadStatus } = require("../controllers/leadController");
const { validLeadStatus, validateCreateLead } = require("../validators/leadValidator");
const { validateLeadQuery } = require("../validators/queryValidator");

const router = express.Router();


router.post("/", validateCreateLead, createLead);
router.get("/", validateLeadQuery, getAllLeads);
router.get("/:id",getLeadById);
router.patch("/:id/status", validLeadStatus, updateLeadStatus);


module.exports = router;