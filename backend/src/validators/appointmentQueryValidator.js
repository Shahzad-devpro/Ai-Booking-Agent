const validateAppointmentQuery =
    (req, res, next) => {

        const {
            search = "",
            status = "",
            technicianId = "",
            date = "",
            page = "1",
            limit = "10"
        } = req.query;


        // ========================================================
        // SEARCH
        // ========================================================

        if (
            typeof search !==
                "string" ||
            search.length > 100
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Search must be a string with a maximum of 100 characters"
            });
        }


        // ========================================================
        // STATUS
        // ========================================================

        const validStatuses = [
            "BOOKED",
            "CANCELLED",
            "COMPLETED"
        ];


        if (
            status &&
            !validStatuses.includes(
                status
            )
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Invalid appointment status"
            });
        }


        // ========================================================
        // TECHNICIAN
        // ========================================================

        if (
            typeof technicianId !==
                "string" ||
            technicianId.length > 100
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Invalid technician ID"
            });
        }


        // ========================================================
        // DATE
        // ========================================================

        if (date) {

            if (
                !/^\d{4}-\d{2}-\d{2}$/.test(
                    date
                )
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Date must use YYYY-MM-DD format"
                });
            }


            const parsedDate =
                new Date(
                    `${date}T00:00:00Z`
                );


            if (
                Number.isNaN(
                    parsedDate.getTime()
                )
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Invalid date"
                });
            }
        }


        // ========================================================
        // PAGE
        // ========================================================

        const pageNumber =
            Number(page);


        if (
            !Number.isInteger(
                pageNumber
            ) ||
            pageNumber < 1
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Page must be a positive integer"
            });
        }


        // ========================================================
        // LIMIT
        // ========================================================

        const limitNumber =
            Number(limit);


        if (
            !Number.isInteger(
                limitNumber
            ) ||
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
    validateAppointmentQuery
};