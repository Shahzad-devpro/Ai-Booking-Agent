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


module.exports = {

    getBookedAppointmentByCustomerPhone

};