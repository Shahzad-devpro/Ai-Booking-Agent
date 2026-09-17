const validateLeadQuery = (req, res, next) => {
    const {
        search = "",
        page = "1",
        limit = "10"
    } = req.query;


    /*
     * SEARCH
     */

    if (
        typeof search !== "string" ||
        search.length > 100
    ) {
        return res.status(400).json({
            success: false,
            message:
                "Search must be a string with a maximum of 100 characters"
        });
    }


    /*
     * PAGE
     */

    const pageNumber = Number(page);

    if (
        !Number.isInteger(pageNumber) ||
        pageNumber < 1
    ) {
        return res.status(400).json({
            success: false,
            message:
                "Page must be a positive integer"
        });
    }


    /*
     * LIMIT
     */

    const limitNumber = Number(limit);

    if (
        !Number.isInteger(limitNumber) ||
        limitNumber < 1 ||
        limitNumber > 50
    ) {
        return res.status(400).json({
            success: false,
            message:
                "Limit must be between 1 and 50"
        });
    }


    next();
};


module.exports = {
    validateLeadQuery
};