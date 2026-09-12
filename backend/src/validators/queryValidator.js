const validateLeadQuery = (req, res, next) => {
    const { page = "1", limit = "10" } = req.query;

    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    if (
        !Number.isInteger(pageNumber) ||
        pageNumber < 1
    ) {
        return res.status(400).json({
            success: false,
            message: "Page must be a positive integer"
        });
    }

    if (
        !Number.isInteger(limitNumber) ||
        limitNumber < 1 ||
        limitNumber > 100
    ) {
        return res.status(400).json({
            success: false,
            message: "Limit must be between 1 and 100"
        });
    }

    next();
};

module.exports = {
    validateLeadQuery
};