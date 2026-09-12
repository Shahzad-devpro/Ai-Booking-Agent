const express = require("express");
const { createLead, getAllLeads } = require("../controllers/leadController");
const router = express.Router();


router.post("/",createLead);
router.get("/", getAllLeads);


module.exports = router;