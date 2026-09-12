const prisma = require("../config/database");
const createLead = async (leadData) => {
    const{
        name,
        phone,
        email,
        address,
        service,
        problemDescription,
        urgency
    } = leadData;

    const customer = await prisma.customer.create({
        data: {
            name,
            phone,
            email,
            address
        }
    });

    const lead = await prisma.lead.create({
        data: {
            customerId: customer.id,
            service,
            problemDescription,
            urgency
        },
        include: {
            customer: true
        }  
    });

    return lead;
};

const getAllLeads = async() => {
    const leads = await prisma.lead.findMany({
        include: {
            customer: true
        },
        orderBy: {
            createdAt: "desc"
        }
    });

    return leads;
};

const getLeadById = async (id) => {
    const lead = await prisma.lead.findUnique({
        where: { id },
        include : { customer: true}
    });

    return lead;
};
const updateLeadStatus = async (id, status) => {
    const lead = await prisma.lead.update({
        where: { id },
        data: {status},
        include: {customer: true}
    });
    return lead;
}

module.exports = {
    createLead,
    getAllLeads,
    getLeadById,
    updateLeadStatus
};