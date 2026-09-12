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

module.exports = {
    validLeadStatus
}
