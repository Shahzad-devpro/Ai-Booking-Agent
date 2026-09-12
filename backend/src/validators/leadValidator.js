const validLeadStatuses = [
    "NEW",
    "AI_QUALIFIED",
    "CONTACTED",
    "BOOKED",
    "IN_PROGRESS",
    "COMPLETED",
    "CANCELLED",
    "LOST"
];
const validUrgencies = [
    "LOW",
    "NORMAL",
    "HIGH",
    "EMERGENCY"
];


const validLeadStatus =(req, res, next) => {
    const { status } = req.body;
    if(!status){
        return res.status(400).json({
            success: false,
            message: "status is required"
        });
    }
    if(!validLeadStatuses.includes(status)){
        return res.status(400).json({
            success:false,
            message:"Invalid lead status"
        });
    }
    next();
};

const validateCreateLead = (req, res, next) => {
    const {
        name,
        phone,
        address,
        service,
        problemDescription,
        urgency
    } = req.body;

    if (!name || !phone || !address || !service || !problemDescription) {
        return res.status(400).json({
            success: false,
            message: "Name, phone, address, service and problem description are required"
        });
    }

    if (urgency && !validUrgencies.includes(urgency)) {
        return res.status(400).json({
            success: false,
            message: "Invalid urgency"
        });
    }

    next();
};

module.exports = {
    validLeadStatus,
    validateCreateLead
}
