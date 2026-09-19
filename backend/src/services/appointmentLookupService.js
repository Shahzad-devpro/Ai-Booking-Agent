/*
|--------------------------------------------------------------------------
| APPOINTMENT LOOKUP SERVICE
|--------------------------------------------------------------------------
|
| Finds existing appointments using customer information.
|
| IMPORTANT:
| This service does NOT create, cancel, or reschedule appointments.
| It only retrieves existing appointment records.
|
*/

const prisma =
    require("../config/database");


// ============================================================
// FIND BOOKED APPOINTMENT BY CUSTOMER PHONE
// ============================================================

const getBookedAppointmentByCustomerPhone =
    async (phone) => {

        if (
            !phone ||
            typeof phone !== "string"
        ) {

            return null;

        }


        const normalizedPhone =
            phone.trim();


        if (
            normalizedPhone.length === 0
        ) {

            return null;

        }


        const appointment =
            await prisma.appointment.findFirst({

                where: {

                    status: "BOOKED",

                    customer: {

                        phone:
                            normalizedPhone

                    }

                },

                include: {

                    customer: true,

                    lead: true,

                    technician: true

                },

                orderBy: {

                    createdAt: "desc"

                }

            });


        return appointment;

    };


// ============================================================
// FIND BOOKED APPOINTMENT BY CUSTOMER INFO (PHONE, EMAIL, NAME)
// ============================================================

const findBookedAppointmentByCustomerInfo =
    async ({ phone, email, name }) => {

        const conditions = [];

        if (phone && typeof phone === "string" && phone.trim().length > 0) {
            conditions.push({
                customer: {
                    phone: phone.trim()
                }
            });
        }

        if (email && typeof email === "string" && email.trim().length > 0) {
            conditions.push({
                customer: {
                    email: {
                        equals: email.trim(),
                        mode: "insensitive"
                    }
                }
            });
        }

        if (name && typeof name === "string" && name.trim().length > 0) {
            conditions.push({
                customer: {
                    name: {
                        contains: name.trim(),
                        mode: "insensitive"
                    }
                }
            });
        }

        if (conditions.length === 0) {
            return null;
        }

        const appointment =
            await prisma.appointment.findFirst({

                where: {

                    status: "BOOKED",

                    OR: conditions

                },

                include: {

                    customer: true,

                    lead: true,

                    technician: true

                },

                orderBy: {

                    createdAt: "desc"

                }

            });


        return appointment;

    };


module.exports = {

    getBookedAppointmentByCustomerPhone,

    findBookedAppointmentByCustomerInfo

};
