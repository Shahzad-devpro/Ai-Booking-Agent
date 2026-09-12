const { message } = require("../config/database");
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

const getLeadById = async (req,res) => {
    try{
        const lead = await leadService.getLeadById(req.params.id);

        if(!lead) {
            return res.status(404).json({
                success: false,
                message: "Lead not found"
            });
        } 
        res.status(200).json({
            success: true,
            Date: lead
        });
    } catch(error){
        console.log("Get lead error",error);

        res.status(500).json({
            success: false,
            message: "failed to fetch lead"
        });
    }
};

const updateLeadStatus = async(req, res) => {
    try{
        const{status} = req.body;
        const lead = await leadService.updateLeadStatus(req.params.id, status);
        res.status(200).json({
            success: true,
            message: "Lead status updated successfully",
            data: lead
        });
    } catch(error){
        console.log("Update lead status error:",error);

        res.status(500).json({
            success: false,
            message: "Failed to upload the lead status"
        });
    }

};

module.exports = {
    createLead,
    getAllLeads,
    getLeadById,
    updateLeadStatus
};