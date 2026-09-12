const express = require("express");
const { createLead, getAllLeads, getLeadById, updateLeadStatus } = require("../controllers/leadController");
const { validLeadStatus } = require("../validators/leadValidator");
const router = express.Router();


router.post("/",createLead);
router.get("/", getAllLeads);
router.get("/:id",getLeadById);
router.patch("/:id/status", validLeadStatus, updateLeadStatus);


module.exports = router;