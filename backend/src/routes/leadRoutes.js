const express = require("express");
const { createLead, getAllLeads, getLeadById, updateLeadStatus } = require("../controllers/leadController");
const router = express.Router();


router.post("/",createLead);
router.get("/", getAllLeads);
router.get("/:id",getLeadById);
router.patch("/:id/status", updateLeadStatus);


module.exports = router;