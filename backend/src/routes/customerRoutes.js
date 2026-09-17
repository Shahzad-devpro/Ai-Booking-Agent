const express = require("express");

const {
    getAllCustomers,
    getCustomerById
} = require("../controllers/customerController");

const authMiddleware =
    require("../middleware/authMiddleware");

const router =
    express.Router();


router.get(
    "/",
    authMiddleware,
    getAllCustomers
);


router.get(
    "/:id",
    authMiddleware,
    getCustomerById
);


module.exports = router;