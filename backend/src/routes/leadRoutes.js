const express = require("express");
const { createLead, getAllLeads, getLeadById } = require("../controllers/leadController");
const router = express.Router();


router.post("/",createLead);
router.get("/", getAllLeads);
router.get("/:id",getLeadById);


module.exports = router;