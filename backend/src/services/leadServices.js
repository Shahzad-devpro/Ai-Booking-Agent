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

const getAllLeads = async ({
    status,
    urgency,
    page = 1,
    limit = 10
}) => {
    const skip = (page - 1) * limit;

    const where = {};

    if (status) {
        where.status = status;
    }

    if (urgency) {
        where.urgency = urgency;
    }

    const [leads, total] = await Promise.all([
        prisma.lead.findMany({
            where,
            include: {
                customer: true
            },
            orderBy: {
                createdAt: "desc"
            },
            skip,
            take: limit
        }),

        prisma.lead.count({
            where
        })
    ]);

    return {
        leads,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
    };
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