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

const createLeadFromConversation = async ({
    conversationId,
    leadData
}) => {

    return prisma.$transaction(async (tx) => {

        const conversation =
            await tx.conversation.findUnique({
                where: {
                    id: conversationId
                }
            });

        if (!conversation) {
            const error = new Error(
                "Conversation not found"
            );

            error.statusCode = 404;
            throw error;
        }

        // Prevent duplicate lead creation
        if (conversation.leadId) {
            const existingLead =
                await tx.lead.findUnique({
                    where: {
                        id: conversation.leadId
                    },
                    include: {
                        customer: true
                    }
                });

            return existingLead;
        }

        const customer =
            await tx.customer.create({
                data: {
                    name: leadData.customer.name,
                    phone: leadData.customer.phone,
                    email: leadData.customer.email,
                    address: leadData.customer.address
                }
            });

        const lead =
            await tx.lead.create({
                data: {
                    customerId: customer.id,
                    service: leadData.service,
                    problemDescription:
                        leadData.problemDescription,
                    urgency: leadData.urgency,
                    status: "AI_QUALIFIED"
                },
                include: {
                    customer: true
                }
            });

        await tx.conversation.update({
            where: {
                id: conversationId
            },
            data: {
                leadId: lead.id
            }
        });

        return lead;
    });
};

const getAllLeads = async ({
    search = "",
    status,
    urgency,
    page = 1,
    limit = 10
}) => {

    const safePage =
        Math.max(
            1,
            Number(page) || 1
        );

    const safeLimit =
        Math.min(
            50,
            Math.max(
                1,
                Number(limit) || 10
            )
        );

    const skip =
        (safePage - 1) *
        safeLimit;


    const where = {};


    /*
     * STATUS
     */

    if (status) {
        where.status = status;
    }


    /*
     * URGENCY
     */

    if (urgency) {
        where.urgency = urgency;
    }


    /*
     * SERVER-SIDE SEARCH
     */

    const normalizedSearch =
        search.trim();


    if (normalizedSearch) {

        where.OR = [
            {
                customer: {
                    name: {
                        contains:
                            normalizedSearch,
                        mode: "insensitive"
                    }
                }
            },

            {
                customer: {
                    phone: {
                        contains:
                            normalizedSearch
                    }
                }
            },

            {
                customer: {
                    email: {
                        contains:
                            normalizedSearch,
                        mode: "insensitive"
                    }
                }
            },

            {
                service: {
                    contains:
                        normalizedSearch,
                        mode: "insensitive"
                }
            }
        ];
    }


    /*
     * FETCH + COUNT
     */

    const [
        leads,
        total
    ] = await Promise.all([

        prisma.lead.findMany({
            where,

            select: {
                id: true,
                service: true,
                problemDescription: true,
                urgency: true,
                status: true,
                createdAt: true,

                customer: {
                    select: {
                        id: true,
                        name: true,
                        phone: true,
                        email: true,
                        address: true
                    }
                }
            },

            orderBy: {
                createdAt: "desc"
            },

            skip,
            take: safeLimit
        }),


        prisma.lead.count({
            where
        })

    ]);


    return {
        leads,
        total,
        page: safePage,
        limit: safeLimit,
        totalPages:
            Math.ceil(
                total / safeLimit
            )
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
    createLeadFromConversation,
    getAllLeads,
    getLeadById,
    updateLeadStatus
};