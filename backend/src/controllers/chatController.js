const aiService =
    require("../services/aiService");

const conversationService =
    require("../services/conversationService");

const leadServices =
    require("../services/leadServices");

const appointmentService =
    require("../services/appointmentService");

const {
    validateExtractedLeadData,
    getLeadQualification
} = require("../services/leadExtractionService");

const {
    getAppointmentIntent
} = require("../services/appointmentIntentService");

const {
    getBookingIntent
} = require("../services/bookingIntentService");

const {
    checkRequestedSlot
} = require("../services/appointmentAvailabilityService");

const {
    BUSINESS_TIMEZONE,
    SLOT_DURATION_HOURS
} = require("../config/businessConfig");

const {
    DateTime
} = require("luxon");


// ============================================================
// CHAT CONTROLLER
// ============================================================

const chat = async (req, res, next) => {

    try {

        const {
            conversationId,
            message
        } = req.body;


        // ----------------------------------------------------
        // 1. Validate incoming message
        // ----------------------------------------------------

        if (
            !message ||
            typeof message !== "string" ||
            message.trim().length === 0
        ) {

            return res.status(400).json({

                success: false,

                message: "Message is required"

            });

        }


        const currentMessage =
            message.trim();


        let conversation;


        // ----------------------------------------------------
        // 2. Create or retrieve conversation
        // ----------------------------------------------------

        if (!conversationId) {

            conversation =
                await conversationService
                    .createConversation();

        } else {

            conversation =
                await conversationService
                    .getConversationById(
                        conversationId
                    );


            if (!conversation) {

                return res.status(404).json({

                    success: false,

                    message: "Conversation not found"

                });

            }

        }


        // ----------------------------------------------------
        // 3. Save customer's message
        // ----------------------------------------------------

        await conversationService.addMessage(

            conversation.id,

            "USER",

            currentMessage

        );


        // ----------------------------------------------------
        // 4. Reload conversation
        // ----------------------------------------------------

        conversation =
            await conversationService
                .getConversationById(
                    conversation.id
                );


        // ----------------------------------------------------
        // 5. Extract structured lead information
        // ----------------------------------------------------

        const extractedData =
            await aiService.extractLeadData(
                conversation.messages
            );


        // ----------------------------------------------------
        // 6. Validate AI output
        // ----------------------------------------------------

        const validatedData =
            validateExtractedLeadData(
                extractedData
            );


        // ----------------------------------------------------
        // 7. Determine appointment intent
        // ----------------------------------------------------

        const appointmentIntent =
            getAppointmentIntent(
                validatedData
            );


        // ----------------------------------------------------
        // 8. Determine booking confirmation intent
        // ----------------------------------------------------

        const bookingIntent =
            getBookingIntent({

                wantsAppointment:
                    appointmentIntent.wantsAppointment,

                preferredDate:
                    validatedData.preferredDate,

                preferredTime:
                    validatedData.preferredTime,

                customerMessage:
                    currentMessage

            });


        console.log(
            "VALIDATED AI DATA:"
        );

        console.log(
            JSON.stringify(
                validatedData,
                null,
                2
            )
        );


        console.log(
            "APPOINTMENT INTENT:"
        );

        console.log(
            JSON.stringify(
                appointmentIntent,
                null,
                2
            )
        );


        console.log(
            "BOOKING INTENT:"
        );

        console.log(
            JSON.stringify(
                bookingIntent,
                null,
                2
            )
        );


        // ----------------------------------------------------
        // 9. Determine qualification
        // ----------------------------------------------------

        const qualification =
            getLeadQualification(
                validatedData
            );


        // ----------------------------------------------------
        // 10. Create/retrieve lead when qualified
        // ----------------------------------------------------
        //
        // IMPORTANT:
        //
        // createLeadFromConversation() already prevents
        // duplicate lead creation using conversation.leadId.
        //
        // Therefore:
        //
        // First qualified message → creates lead
        //
        // Later booking message → returns SAME lead
        //
        // ----------------------------------------------------

        let lead = null;


        if (
            qualification.qualified
        ) {

            lead =
                await leadServices
                    .createLeadFromConversation({

                        conversationId:
                            conversation.id,

                        leadData:
                            validatedData

                    });

        }


        // ====================================================
        // 11. BOOKING CONFIRMATION FLOW
        // ====================================================
        //
        // This must happen BEFORE normal availability
        // response generation.
        //
        // Otherwise:
        //
        // "Yes, book it"
        //
        // could accidentally produce another
        // "Would you like me to book it?"
        //
        // ====================================================

        if (
            bookingIntent.readyForBooking
        ) {


            // ------------------------------------------------
            // 11A. Make sure a qualified lead exists
            // ------------------------------------------------

            if (!lead) {

                return res.status(400).json({

                    success: false,

                    message:
                        "The appointment cannot be booked because the customer information is incomplete.",

                    data: {

                        conversationId:
                            conversation.id,

                        qualification,

                        appointmentIntent,

                        bookingIntent

                    }

                });

            }


            // ------------------------------------------------
            // 11B. Re-check availability
            // ------------------------------------------------
            //
            // VERY IMPORTANT:
            //
            // Availability shown to customer earlier may now
            // be stale.
            //
            // Another customer could have booked the slot.
            //
            // Therefore we ALWAYS check again immediately
            // before creating the appointment.
            //
            // ------------------------------------------------

            const bookingAvailability =
                await checkRequestedSlot({

                    preferredDate:
                        validatedData.preferredDate,

                    preferredTime:
                        validatedData.preferredTime

                });


            console.log(
                "BOOKING AVAILABILITY RE-CHECK:"
            );

            console.log(
                JSON.stringify(
                    bookingAvailability,
                    null,
                    2
                )
            );


            // ------------------------------------------------
            // 11C. Slot became unavailable
            // ------------------------------------------------

            if (
                !bookingAvailability.available
            ) {

                const aiResponse =
                    await aiService
                        .generateAvailabilityResponse({

                            conversationMessages:
                                conversation.messages,

                            availability:
                                bookingAvailability,

                            preferredDate:
                                validatedData.preferredDate,

                            preferredTime:
                                validatedData.preferredTime

                        });


                if (
                    !aiResponse ||
                    typeof aiResponse !== "string" ||
                    aiResponse.trim().length === 0
                ) {

                    const error =
                        new Error(
                            "AI failed to generate availability response"
                        );

                    error.statusCode = 502;

                    throw error;

                }


                await conversationService.addMessage(

                    conversation.id,

                    "ASSISTANT",

                    aiResponse.trim()

                );


                return res.status(200).json({

                    success: true,

                    data: {

                        conversationId:
                            conversation.id,

                        message:
                            aiResponse.trim(),

                        qualification,

                        appointmentIntent,

                        bookingIntent,

                        availability:
                            bookingAvailability,

                        lead

                    }

                });

            }


            // ------------------------------------------------
            // 11D. Build appointment start/end times
            // ------------------------------------------------

            const start =
                DateTime.fromISO(
                    `${validatedData.preferredDate}T${validatedData.preferredTime}`,
                    {
                        zone: BUSINESS_TIMEZONE
                    }
                );


            if (!start.isValid) {

                const error =
                    new Error(
                        "Unable to create a valid appointment time"
                    );

                error.statusCode = 400;

                throw error;

            }


            const end =
                start.plus({
                    hours:
                        SLOT_DURATION_HOURS
                });


            // ------------------------------------------------
            // 11E. Create appointment
            // ------------------------------------------------
            //
            // appointmentService performs the final backend
            // validation and technician assignment.
            //
            // We DO NOT trust AI for booking.
            //
            // ------------------------------------------------

            let appointment;


            try {

                appointment =
                    await appointmentService
                        .createAppointment({

                            leadId:
                                lead.id,

                            customerId:
                                lead.customerId,

                            startTime:
                                start.toISO(),

                            endTime:
                                end.toISO(),

                            notes:
                                "Booked through AI receptionist"

                        });

            } catch (bookingError) {

                // --------------------------------------------
                // Handle race condition:
                //
                // Availability was true a moment ago, but
                // another customer may have booked the final
                // technician before createAppointment().
                // --------------------------------------------

                if (
                    bookingError.statusCode === 409
                ) {

                    const latestAvailability =
                        await checkRequestedSlot({

                            preferredDate:
                                validatedData.preferredDate,

                            preferredTime:
                                validatedData.preferredTime

                        });


                    const aiResponse =
                        await aiService
                            .generateAvailabilityResponse({

                                conversationMessages:
                                    conversation.messages,

                                availability:
                                    latestAvailability,

                                preferredDate:
                                    validatedData.preferredDate,

                                preferredTime:
                                    validatedData.preferredTime

                            });


                    await conversationService.addMessage(

                        conversation.id,

                        "ASSISTANT",

                        aiResponse.trim()

                    );


                    return res.status(200).json({

                        success: true,

                        data: {

                            conversationId:
                                conversation.id,

                            message:
                                aiResponse.trim(),

                            qualification,

                            appointmentIntent,

                            bookingIntent,

                            availability:
                                latestAvailability,

                            lead

                        }

                    });

                }


                throw bookingError;

            }


            // ------------------------------------------------
            // 11F. Generate deterministic booking confirmation
            // ------------------------------------------------
            //
            // IMPORTANT:
            //
            // Do NOT ask the LLM whether the appointment was
            // booked.
            //
            // appointmentService already proved it.
            //
            // ------------------------------------------------

            const formattedDate =
                start.toFormat(
                    "MMMM d, yyyy"
                );

            const formattedStartTime =
                start.toFormat(
                    "h:mm a"
                );

            const formattedEndTime =
                end.toFormat(
                    "h:mm a"
                );


            const technicianName =
                appointment.technician?.name ||
                "our technician";


            const bookingConfirmation =
                `You're all set, ${lead.customer.name}. Your appointment is booked for ${formattedDate} from ${formattedStartTime} to ${formattedEndTime}. ${technicianName} has been assigned to your appointment. Your appointment ID is ${appointment.id}.`;


            // ------------------------------------------------
            // 11G. Save booking confirmation
            // ------------------------------------------------

            await conversationService.addMessage(

                conversation.id,

                "ASSISTANT",

                bookingConfirmation

            );


            // ------------------------------------------------
            // 11H. Reload conversation
            // ------------------------------------------------

            conversation =
                await conversationService
                    .getConversationById(
                        conversation.id
                    );


            // ------------------------------------------------
            // 11I. Return successful booking
            // ------------------------------------------------

            return res.status(200).json({

                success: true,

                data: {

                    conversationId:
                        conversation.id,

                    message:
                        bookingConfirmation,

                    qualification,

                    appointmentIntent,

                    bookingIntent,

                    availability:
                        bookingAvailability,

                    lead:
                        appointment.lead,

                    appointment

                }

            });

        }


        // ====================================================
        // 12. NORMAL AVAILABILITY FLOW
        // ====================================================

        let availability = null;


        if (
            appointmentIntent.readyForAvailabilityCheck
        ) {

            availability =
                await checkRequestedSlot({

                    preferredDate:
                        validatedData.preferredDate,

                    preferredTime:
                        validatedData.preferredTime

                });


            console.log(
                "APPOINTMENT AVAILABILITY:"
            );

            console.log(
                JSON.stringify(
                    availability,
                    null,
                    2
                )
            );

        }


        // ====================================================
        // 13. Generate normal AI response
        // ====================================================

        let aiResponse;


        if (
            appointmentIntent.readyForAvailabilityCheck
        ) {

            aiResponse =
                await aiService
                    .generateAvailabilityResponse({

                        conversationMessages:
                            conversation.messages,

                        availability,

                        preferredDate:
                            validatedData.preferredDate,

                        preferredTime:
                            validatedData.preferredTime

                    });

        } else {

            aiResponse =
                await aiService
                    .generateAIResponse(
                        conversation.messages
                    );

        }


        // ----------------------------------------------------
        // 14. Validate AI response
        // ----------------------------------------------------

        if (
            !aiResponse ||
            typeof aiResponse !== "string" ||
            aiResponse.trim().length === 0
        ) {

            const error =
                new Error(
                    "AI failed to generate a response"
                );

            error.statusCode = 502;

            throw error;

        }


        // ----------------------------------------------------
        // 15. Save AI response
        // ----------------------------------------------------

        await conversationService.addMessage(

            conversation.id,

            "ASSISTANT",

            aiResponse.trim()

        );


        // ----------------------------------------------------
        // 16. Reload conversation
        // ----------------------------------------------------

        conversation =
            await conversationService
                .getConversationById(
                    conversation.id
                );


        // ----------------------------------------------------
        // 17. Return normal response
        // ----------------------------------------------------

        return res.status(200).json({

            success: true,

            data: {

                conversationId:
                    conversation.id,

                message:
                    aiResponse.trim(),

                qualification,

                appointmentIntent,

                bookingIntent,

                availability,

                lead

            }

        });

    } catch (error) {

        next(error);

    }

};


// ============================================================
// EXPORTS
// ============================================================

module.exports = {
    chat
};