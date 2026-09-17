const prisma = require("../config/database");

/*
|--------------------------------------------------------------------------
| GET ALL CUSTOMERS
|--------------------------------------------------------------------------
*/

const getAllCustomers = async ({
    search = "",
    page = 1,
    limit = 10
}) => {

    const normalizedPage =
        Math.max(Number(page) || 1, 1);

    const normalizedLimit =
        Math.min(
            Math.max(Number(limit) || 10, 1),
            100
        );

    const skip =
        (normalizedPage - 1) *
        normalizedLimit;

    const normalizedSearch =
        typeof search === "string"
            ? search.trim()
            : "";

    const where =
        normalizedSearch.length > 0
            ? {
                OR: [
                    {
                        name: {
                            contains:
                                normalizedSearch,
                            mode: "insensitive"
                        }
                    },
                    {
                        phone: {
                            contains:
                                normalizedSearch,
                            mode: "insensitive"
                        }
                    },
                    {
                        email: {
                            contains:
                                normalizedSearch,
                            mode: "insensitive"
                        }
                    },
                    {
                        address: {
                            contains:
                                normalizedSearch,
                            mode: "insensitive"
                        }
                    }
                ]
            }
            : {};

    const [
        customers,
        total
    ] = await Promise.all([

        prisma.customer.findMany({
            where,

            include: {
                _count: {
                    select: {
                        leads: true,
                        appointments: true
                    }
                }
            },

            orderBy: {
                createdAt: "desc"
            },

            skip,

            take: normalizedLimit
        }),

        prisma.customer.count({
            where
        })
    ]);

    return {
        customers,
        total,
        page: normalizedPage,
        limit: normalizedLimit,
        totalPages:
            Math.ceil(
                total / normalizedLimit
            )
    };
};


/*
|--------------------------------------------------------------------------
| GET CUSTOMER BY ID
|--------------------------------------------------------------------------
*/

const getCustomerById = async (
    customerId
) => {

    if (!customerId) {

        const error =
            new Error(
                "Customer ID is required"
            );

        error.statusCode = 400;

        throw error;
    }

    const customer =
        await prisma.customer.findUnique({

            where: {
                id: customerId
            },

            include: {

                leads: {
                    orderBy: {
                        createdAt: "desc"
                    }
                },

                appointments: {
                    include: {
                        technician: true,
                        lead: true
                    },

                    orderBy: {
                        startTime: "desc"
                    }
                },

                _count: {
                    select: {
                        leads: true,
                        appointments: true
                    }
                }
            }
        });

    if (!customer) {

        const error =
            new Error(
                "Customer not found"
            );

        error.statusCode = 404;

        throw error;
    }

    return customer;
};


module.exports = {
    getAllCustomers,
    getCustomerById
};