const prisma = require("../src/config/database");

const createTechnicians = async () => {
    try {
        const technicians = await prisma.technician.createMany({
            data: [
                {
                    name: "Mike Johnson",
                    phone: "555-100-1001",
                    email: "mike@example.com",
                    active: true
                },
                {
                    name: "Sarah Williams",
                    phone: "555-100-1002",
                    email: "sarah@example.com",
                    active: true
                },
                {
                    name: "David Brown",
                    phone: "555-100-1003",
                    email: "david@example.com",
                    active: true
                }
            ]
        });

        console.log("Technicians created:", technicians);
    } catch (error) {
        console.error(error);
    } finally {
        await prisma.$disconnect();
    }
};

createTechnicians();
