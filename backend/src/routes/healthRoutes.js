const express = require("express");
const{
    databaseHealth
} = require("../controllers/healthController");

const router = express.Router();
router.get("/database", databaseHealth);
module.exports = router;