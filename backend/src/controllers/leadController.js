const leadService = require("../services/leadServices");
const createLead = async (req,res) => {
    try{
        const lead = await leadService.createLead(req.body);
        res.status(201).json({
            success: true,
            message: "lead created successfully",
            data: lead
        });
    }
    catch(error){
        console.error("Create lead error:",error);
        res.status(500).json({
            success: false,
            message: "Failed to create lead"
        });

    }
};

const getAllLeads = async (req, res) => {
    try{
        const leads = await leadService.getAllLeads();

        res.status(200).json({
            success: true,
            data: leads
        });
    } catch(error){
        console.error("Get leads error:",error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch leads"
        });
    }
};

module.exports = {
    createLead,
    getAllLeads
};