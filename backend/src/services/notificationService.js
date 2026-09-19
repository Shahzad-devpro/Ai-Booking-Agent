const { Resend } = require("resend");

const prisma =
    require("../config/database");

const {
    BUSINESS_TIMEZONE
} = require("../config/businessConfig");


const resend =
    process.env.RESEND_API_KEY
        ? new Resend(
            process.env.RESEND_API_KEY
        )
        : null;


// ============================================================
// CONFIG
// ============================================================

const DEFAULT_SETTINGS_ID =
    "default";


// ============================================================
// HELPERS
// ============================================================

const getBusinessEmail =
    () =>
        process.env.BUSINESS_NOTIFICATION_EMAIL;


const getEmailFrom =
    () =>
        process.env.EMAIL_FROM ||
        "CoolAir HVAC <onboarding@resend.dev>";


const formatDateTime =
    value => {

        if (!value) {
            return "N/A";
        }

        return new Intl.DateTimeFormat(
            "en-US",
            {
                timeZone:
                    BUSINESS_TIMEZONE,

                weekday:
                    "long",

                year:
                    "numeric",

                month:
                    "long",

                day:
                    "numeric",

                hour:
                    "numeric",

                minute:
                    "2-digit",

                hour12:
                    true
            }
        ).format(
            new Date(value)
        );
    };


const escapeHtml =
    value => {

        if (
            value === null ||
            value === undefined
        ) {

            return "";
        }

        return String(value)
            .replace(
                /&/g,
                "&amp;"
            )
            .replace(
                /</g,
                "&lt;"
            )
            .replace(
                />/g,
                "&gt;"
            )
            .replace(
                /"/g,
                "&quot;"
            )
            .replace(
                /'/g,
                "&#039;"
            );
    };


const createNotificationRecord =
    async ({
        type,
        title,
        message,
        recipientEmail
    }) => {

        return prisma.notification.create({

            data: {

                type,

                title,

                message,

                recipientEmail:
                    recipientEmail || null

            }

        });
    };


const sendEmail =
    async ({
        to,
        subject,
        html
    }) => {

        if (!to) {
            return null;
        }

        if (!resend) {
            return null;
        }

        try {

            const {
                data,
                error
            } =
                await resend.emails.send({

                    from:
                        getEmailFrom(),

                    to:
                        [to],

                    subject,

                    html

                });


            if (error) {

                console.error(
                    "Notification email provider error:",
                    error
                );

                return null;
            }


            return data;

        } catch (error) {

            console.error(
                "Notification email sending failed:",
                error.message
            );

            return null;
        }
    };


// ============================================================
// SETTINGS
// ============================================================

const getNotificationSettings =
    async () => {

        let settings =
            await prisma
                .notificationSetting
                .findUnique({

                    where: {

                        id:
                            DEFAULT_SETTINGS_ID

                    }

                });


        if (!settings) {

            settings =
                await prisma
                    .notificationSetting
                    .create({

                        data: {

                            id:
                                DEFAULT_SETTINGS_ID,

                            businessEmail:
                                getBusinessEmail() ||
                                "",

                            leadCreated:
                                true,

                            appointmentBooked:
                                true,

                            appointmentCancelled:
                                true,

                            appointmentRescheduled:
                                true,

                            customerEmails:
                                true

                        }

                    });
        }


        return settings;
    };


const updateNotificationSettings =
    async ({
        businessEmail,
        leadCreated,
        appointmentBooked,
        appointmentCancelled,
        appointmentRescheduled,
        customerEmails
    }) => {

        const current =
            await getNotificationSettings();


        return prisma
            .notificationSetting
            .update({

                where: {

                    id:
                        DEFAULT_SETTINGS_ID

                },

                data: {

                    businessEmail:
                        businessEmail !== undefined
                            ? businessEmail
                            : current.businessEmail,

                    leadCreated:
                        leadCreated !== undefined
                            ? leadCreated
                            : current.leadCreated,

                    appointmentBooked:
                        appointmentBooked !== undefined
                            ? appointmentBooked
                            : current.appointmentBooked,

                    appointmentCancelled:
                        appointmentCancelled !== undefined
                            ? appointmentCancelled
                            : current.appointmentCancelled,

                    appointmentRescheduled:
                        appointmentRescheduled !== undefined
                            ? appointmentRescheduled
                            : current.appointmentRescheduled,

                    customerEmails:
                        customerEmails !== undefined
                            ? customerEmails
                            : current.customerEmails

                }

            });
    };


// ============================================================
// LEAD CREATED
// ============================================================

const notifyLeadCreated =
    async lead => {

        try {

            const settings =
                await getNotificationSettings();


            if (!settings.leadCreated) {
                return;
            }


            const recipient =
                settings.businessEmail ||
                getBusinessEmail();


            const customer =
                lead.customer;


            const title =
                "New Lead Received";


            const message =
                `${customer?.name || "New customer"} submitted a new ${lead.service || "service"} request.`;


            await createNotificationRecord({

                type:
                    "LEAD_CREATED",

                title,

                message,

                recipientEmail:
                    recipient

            });


            await sendEmail({

                to:
                    recipient,

                subject:
                    `New Lead: ${customer?.name || "New Customer"}`,

                html: `
                    <div style="font-family:Arial,sans-serif;max-width:620px;margin:auto;color:#172033">
                        <h2>New Lead Received</h2>

                        <p>
                            A new customer request has been submitted.
                        </p>

                        <hr />

                        <p><strong>Customer:</strong>
                            ${escapeHtml(customer?.name)}
                        </p>

                        <p><strong>Phone:</strong>
                            ${escapeHtml(customer?.phone)}
                        </p>

                        <p><strong>Email:</strong>
                            ${escapeHtml(customer?.email || "Not provided")}
                        </p>

                        <p><strong>Address:</strong>
                            ${escapeHtml(customer?.address)}
                        </p>

                        <p><strong>Service:</strong>
                            ${escapeHtml(lead.service)}
                        </p>

                        <p><strong>Urgency:</strong>
                            ${escapeHtml(lead.urgency)}
                        </p>

                        <p><strong>Problem:</strong>
                            ${escapeHtml(lead.problemDescription)}
                        </p>

                        <hr />

                        <p>
                            Open the dashboard to review and manage this lead.
                        </p>
                    </div>
                `
            });

        } catch (error) {

            console.error(
                "Lead notification failed:",
                error.message
            );
        }
    };


// ============================================================
// APPOINTMENT BOOKED
// ============================================================

const notifyAppointmentBooked =
    async appointment => {

        try {

            const settings =
                await getNotificationSettings();


            const customer =
                appointment.customer;

            const lead =
                appointment.lead;

            const technician =
                appointment.technician;


            const appointmentTime =
                formatDateTime(
                    appointment.startTime
                );


            const businessMessage =
                `${customer?.name || "Customer"} booked an appointment for ${appointmentTime}.`;


            if (settings.appointmentBooked) {

                const recipient =
                    settings.businessEmail ||
                    getBusinessEmail();


                await createNotificationRecord({

                    type:
                        "APPOINTMENT_BOOKED",

                    title:
                        "Appointment Booked",

                    message:
                        businessMessage,

                    recipientEmail:
                        recipient

                });


                await sendEmail({

                    to:
                        recipient,

                    subject:
                        `Appointment Booked — ${customer?.name || "Customer"}`,

                    html: `
                        <div style="font-family:Arial,sans-serif;max-width:620px;margin:auto;color:#172033">
                            <h2>Appointment Booked</h2>

                            <p>
                                A new appointment has been successfully booked.
                            </p>

                            <hr />

                            <p><strong>Customer:</strong>
                                ${escapeHtml(customer?.name)}
                            </p>

                            <p><strong>Phone:</strong>
                                ${escapeHtml(customer?.phone)}
                            </p>

                            <p><strong>Service:</strong>
                                ${escapeHtml(lead?.service)}
                            </p>

                            <p><strong>Appointment:</strong>
                                ${escapeHtml(appointmentTime)}
                            </p>

                            <p><strong>Technician:</strong>
                                ${escapeHtml(technician?.name || "Not assigned")}
                            </p>

                            <p><strong>Urgency:</strong>
                                ${escapeHtml(lead?.urgency)}
                            </p>

                            <hr />

                            <p>
                                The appointment is now visible in the dashboard.
                            </p>
                        </div>
                    `
                });
            }


            if (
                settings.customerEmails &&
                customer?.email
            ) {

                await sendEmail({

                    to:
                        customer.email,

                    subject:
                        "Your HVAC Appointment Is Confirmed",

                    html: `
                        <div style="font-family:Arial,sans-serif;max-width:620px;margin:auto;color:#172033">
                            <h2>Appointment Confirmed</h2>

                            <p>
                                Hi ${escapeHtml(customer.name)},
                            </p>

                            <p>
                                Your service appointment has been confirmed.
                            </p>

                            <hr />

                            <p><strong>Service:</strong>
                                ${escapeHtml(lead?.service)}
                            </p>

                            <p><strong>Date & Time:</strong>
                                ${escapeHtml(appointmentTime)}
                            </p>

                            <p><strong>Technician:</strong>
                                ${escapeHtml(technician?.name || "To be assigned")}
                            </p>

                            <p>
                                Please make sure someone is available at the property during the scheduled appointment.
                            </p>

                            <p>
                                If you need to change or cancel the appointment, contact the business.
                            </p>

                            <p>
                                Thank you,<br />
                                CoolAir HVAC
                            </p>
                        </div>
                    `
                });
            }

        } catch (error) {

            console.error(
                "Booking notification failed:",
                error.message
            );
        }
    };


// ============================================================
// APPOINTMENT CANCELLED
// ============================================================

const notifyAppointmentCancelled =
    async appointment => {

        try {

            const settings =
                await getNotificationSettings();

            const customer =
                appointment.customer;

            const lead =
                appointment.lead;

            const appointmentTime =
                formatDateTime(
                    appointment.startTime
                );


            if (settings.appointmentCancelled) {

                const recipient =
                    settings.businessEmail ||
                    getBusinessEmail();


                await createNotificationRecord({

                    type:
                        "APPOINTMENT_CANCELLED",

                    title:
                        "Appointment Cancelled",

                    message:
                        `${customer?.name || "Customer"} cancelled an appointment scheduled for ${appointmentTime}.`,

                    recipientEmail:
                        recipient

                });


                await sendEmail({

                    to:
                        recipient,

                    subject:
                        `Appointment Cancelled — ${customer?.name || "Customer"}`,

                    html: `
                        <div style="font-family:Arial,sans-serif;max-width:620px;margin:auto;color:#172033">
                            <h2>Appointment Cancelled</h2>

                            <p>
                                An appointment has been cancelled.
                            </p>

                            <hr />

                            <p><strong>Customer:</strong>
                                ${escapeHtml(customer?.name)}
                            </p>

                            <p><strong>Phone:</strong>
                                ${escapeHtml(customer?.phone)}
                            </p>

                            <p><strong>Service:</strong>
                                ${escapeHtml(lead?.service)}
                            </p>

                            <p><strong>Original appointment:</strong>
                                ${escapeHtml(appointmentTime)}
                            </p>
                        </div>
                    `
                });
            }


            if (
                settings.customerEmails &&
                customer?.email
            ) {

                await sendEmail({

                    to:
                        customer.email,

                    subject:
                        "Your HVAC Appointment Has Been Cancelled",

                    html: `
                        <div style="font-family:Arial,sans-serif;max-width:620px;margin:auto;color:#172033">
                            <h2>Appointment Cancelled</h2>

                            <p>
                                Hi ${escapeHtml(customer.name)},
                            </p>

                            <p>
                                Your scheduled service appointment has been cancelled.
                            </p>

                            <p>
                                <strong>Service:</strong>
                                ${escapeHtml(lead?.service)}
                            </p>

                            <p>
                                <strong>Original appointment:</strong>
                                ${escapeHtml(appointmentTime)}
                            </p>

                            <p>
                                Please contact us if you would like to arrange another appointment.
                            </p>

                            <p>
                                Thank you,<br />
                                CoolAir HVAC
                            </p>
                        </div>
                    `
                });
            }

        } catch (error) {

            console.error(
                "Cancellation notification failed:",
                error.message
            );
        }
    };


// ============================================================
// APPOINTMENT RESCHEDULED
// ============================================================

const notifyAppointmentRescheduled =
    async ({
        appointment,
        previousStartTime
    }) => {

        try {

            const settings =
                await getNotificationSettings();

            const customer =
                appointment.customer;

            const lead =
                appointment.lead;

            const technician =
                appointment.technician;


            const oldTime =
                formatDateTime(
                    previousStartTime
                );

            const newTime =
                formatDateTime(
                    appointment.startTime
                );


            if (settings.appointmentRescheduled) {

                const recipient =
                    settings.businessEmail ||
                    getBusinessEmail();


                await createNotificationRecord({

                    type:
                        "APPOINTMENT_RESCHEDULED",

                    title:
                        "Appointment Rescheduled",

                    message:
                        `${customer?.name || "Customer"} moved their appointment from ${oldTime} to ${newTime}.`,

                    recipientEmail:
                        recipient

                });


                await sendEmail({

                    to:
                        recipient,

                    subject:
                        `Appointment Rescheduled — ${customer?.name || "Customer"}`,

                    html: `
                        <div style="font-family:Arial,sans-serif;max-width:620px;margin:auto;color:#172033">
                            <h2>Appointment Rescheduled</h2>

                            <p>
                                An appointment has been moved to a new time.
                            </p>

                            <hr />

                            <p><strong>Customer:</strong>
                                ${escapeHtml(customer?.name)}
                            </p>

                            <p><strong>Service:</strong>
                                ${escapeHtml(lead?.service)}
                            </p>

                            <p><strong>Previous:</strong>
                                ${escapeHtml(oldTime)}
                            </p>

                            <p><strong>New:</strong>
                                ${escapeHtml(newTime)}
                            </p>

                            <p><strong>Technician:</strong>
                                ${escapeHtml(technician?.name || "Not assigned")}
                            </p>
                        </div>
                    `
                });
            }


            if (
                settings.customerEmails &&
                customer?.email
            ) {

                await sendEmail({

                    to:
                        customer.email,

                    subject:
                        "Your HVAC Appointment Has Been Rescheduled",

                    html: `
                        <div style="font-family:Arial,sans-serif;max-width:620px;margin:auto;color:#172033">
                            <h2>Appointment Rescheduled</h2>

                            <p>
                                Hi ${escapeHtml(customer.name)},
                            </p>

                            <p>
                                Your service appointment has been successfully rescheduled.
                            </p>

                            <hr />

                            <p><strong>Service:</strong>
                                ${escapeHtml(lead?.service)}
                            </p>

                            <p><strong>Previous:</strong>
                                ${escapeHtml(oldTime)}
                            </p>

                            <p><strong>New appointment:</strong>
                                ${escapeHtml(newTime)}
                            </p>

                            <p><strong>Technician:</strong>
                                ${escapeHtml(technician?.name || "To be assigned")}
                            </p>

                            <p>
                                Thank you,<br />
                                CoolAir HVAC
                            </p>
                        </div>
                    `
                });
            }

        } catch (error) {

            console.error(
                "Reschedule notification failed:",
                error.message
            );
        }
    };


// ============================================================
// DASHBOARD NOTIFICATIONS
// ============================================================

const getNotifications =
    async ({
        page = 1,
        limit = 20,
        unreadOnly = false
    } = {}) => {

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
                    Number(limit) || 20
                )
            );


        const where = {};

        if (unreadOnly) {
            where.readAt = null;
        }


        const skip =
            (safePage - 1) *
            safeLimit;


        const [
            notifications,
            total
        ] = await Promise.all([

            prisma.notification.findMany({

                where,

                orderBy: {

                    createdAt:
                        "desc"

                },

                skip,

                take:
                    safeLimit

            }),

            prisma.notification.count({

                where

            })

        ]);


        return {

            notifications,

            total,

            page:
                safePage,

            limit:
                safeLimit,

            totalPages:
                Math.ceil(
                    total /
                    safeLimit
                )

        };
    };


const markNotificationAsRead =
    async id => {

        if (!id) {

            const error =
                new Error(
                    "Notification ID is required"
                );

            error.statusCode = 400;

            throw error;
        }


        return prisma.notification.update({

            where: {
                id
            },

            data: {

                readAt:
                    new Date()

            }

        });
    };


const markAllNotificationsAsRead =
    async () => {

        return prisma.notification.updateMany({

            where: {

                readAt:
                    null

            },

            data: {

                readAt:
                    new Date()

            }

        });
    };


const getUnreadNotificationCount =
    async () => {

        return prisma.notification.count({

            where: {

                readAt:
                    null

            }

        });
    };


module.exports = {

    notifyLeadCreated,

    notifyAppointmentBooked,

    notifyAppointmentCancelled,

    notifyAppointmentRescheduled,

    getNotifications,

    markNotificationAsRead,

    markAllNotificationsAsRead,

    getUnreadNotificationCount,

    getNotificationSettings,

    updateNotificationSettings

};