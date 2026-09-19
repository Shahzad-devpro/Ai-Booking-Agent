const leadService =
    require("../services/leadServices");


// ============================================================
// CREATE LEAD
// ============================================================

const createLead = async (req, res, next) => {

    try {

        const lead =
            await leadService.createLead(
                req.body
            );

        res.status(201).json({

            success: true,

            message:
                "Lead created successfully",

            data:
                lead

        });

    } catch (error) {

        next(error);

    }
};


// ============================================================
// GET ALL LEADS
// ============================================================

const getAllLeads = async (req, res, next) => {

    try {

        const {
            search = "",
            status,
            urgency,
            page = "1",
            limit = "10"
        } = req.query;


        const result =
            await leadService.getAllLeads({

                search,
                status,
                urgency,

                page:
                    Number(page),

                limit:
                    Number(limit)

            });


        res.status(200).json({

            success: true,

            data:
                result

        });

    } catch (error) {

        next(error);

    }
};


// ============================================================
// GET LEAD BY ID
// ============================================================

const getLeadById = async (req, res, next) => {

    try {

        const lead =
            await leadService.getLeadById(
                req.params.id
            );


        if (!lead) {

            return res.status(404).json({

                success: false,

                message:
                    "Lead not found"

            });

        }


        res.status(200).json({

            success: true,

            data:
                lead

        });

    } catch (error) {

        next(error);

    }
};


// ============================================================
// UPDATE LEAD STATUS
// ============================================================

const updateLeadStatus =
    async (req, res, next) => {

        try {

            const {
                status
            } = req.body;


            const lead =
                await leadService.updateLeadStatus(

                    req.params.id,

                    status

                );


            res.status(200).json({

                success: true,

                message:
                    "Lead status updated successfully",

                data:
                    lead

            });

        } catch (error) {

            next(error);

        }

    };


// ============================================================
// EXPORTS
// ============================================================

module.exports = {

    createLead,

    getAllLeads,

    getLeadById,

    updateLeadStatus

};