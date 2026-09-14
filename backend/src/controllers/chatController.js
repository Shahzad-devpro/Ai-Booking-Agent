const aiService =
    require("../services/aiService");

const conversationService =
    require("../services/conversationService");

const leadServices =
    require("../services/leadServices");

const appointmentService =
    require("../services/appointmentService");

const appointmentLookupService =
    require("../services/appointmentLookupService");

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
    getCancellationIntent
} = require("../services/cancellationIntentService");

const {
    getRescheduleIntent
} = require("../services/rescheduleIntentService");

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


        // ----------------------------------------------------
        // 9. Determine cancellation intent
        // ----------------------------------------------------

        const cancellationIntent =
            getCancellationIntent({

                customerMessage:
                    currentMessage

            });


        // ----------------------------------------------------
        // 10. Determine reschedule intent
        // ----------------------------------------------------

        const rescheduleIntent =
    getRescheduleIntent({

        customerMessage:
            currentMessage,

        conversationMessages:
            conversation.messages

    });


        // ----------------------------------------------------
        // Debug logs
        // ----------------------------------------------------
        
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


        console.log(
            "CANCELLATION INTENT:"
        );

        console.log(
            JSON.stringify(
                cancellationIntent,
                null,
                2
            )
        );


        console.log(
            "RESCHEDULE INTENT:"
        );

        console.log(
            JSON.stringify(
                rescheduleIntent,
                null,
                2
            )
        );
        console.log(
    "CURRENT CUSTOMER MESSAGE:"
);

console.log(
    currentMessage
);

console.log(
    "RESCHEDULE CONTEXT MESSAGE:"
);

const lastAssistantMessage =
    [...conversation.messages]
        .reverse()
        .find(
            message =>
                message.role === "ASSISTANT"
        );

console.log(
    lastAssistantMessage
        ? lastAssistantMessage.content
        : "No previous assistant message"
);

        // ----------------------------------------------------
        // 11. Determine qualification
        // ----------------------------------------------------

        const qualification =
            getLeadQualification(
                validatedData
            );


        // ----------------------------------------------------
        // 12. Resolve existing lead
        // ----------------------------------------------------
        //
        // Priority:
        //
        // 1. conversation.leadId
        //
        // 2. Customer phone for existing appointment
        //
        // This allows customers to reschedule from a new
        // conversation without repeating all their details.
        //
        // ----------------------------------------------------

        let lead = null;

        let existingAppointment = null;


        // ----------------------------------------------------
        // 12A. Existing conversation lead
        // ----------------------------------------------------

        if (
            conversation.leadId
        ) {

            lead =
                await leadServices
                    .getLeadById(
                        conversation.leadId
                    );

        }


        // ----------------------------------------------------
        // 12B. Existing appointment lookup by phone
        // ----------------------------------------------------
        //
        // Only needed for cancellation/rescheduling when
        // the current conversation has no leadId.
        //
        // ----------------------------------------------------

        if (
            !lead &&
            (
                cancellationIntent.wantsCancellation ||
                rescheduleIntent.wantsReschedule
            )
        ) {

            const customerPhone =
                validatedData.customer?.phone;


            if (customerPhone) {

                existingAppointment =
                    await appointmentLookupService
                        .getBookedAppointmentByCustomerPhone(
                            customerPhone
                        );


                if (
                    existingAppointment
                ) {

                    lead =
                        existingAppointment.lead;

                }

            }

        }


        // ----------------------------------------------------
        // 12C. Debug existing appointment lookup
        // ----------------------------------------------------

        if (
            cancellationIntent.wantsCancellation ||
            rescheduleIntent.wantsReschedule
        ) {

            console.log(
                "EXISTING APPOINTMENT LOOKUP:"
            );

            console.log(

                existingAppointment
                    ? JSON.stringify(
                        {
                            appointmentId:
                                existingAppointment.id,

                            leadId:
                                existingAppointment.leadId,

                            customerId:
                                existingAppointment.customerId,

                            customerPhone:
                                existingAppointment.customer?.phone,

                            status:
                                existingAppointment.status

                        },
                        null,
                        2
                    )
                    : "No appointment found"

            );

        }


        // ----------------------------------------------------
        // 13. Create/retrieve lead when fully qualified
        // ----------------------------------------------------
        //
        // Do NOT replace an existing lead.
        //
        // createLeadFromConversation() already prevents
        // duplicate lead creation for the same conversation.
        //
        // ----------------------------------------------------

        if (
            qualification.qualified &&
            !lead
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
        // 14. CANCELLATION FLOW
        // ====================================================

        if (
            cancellationIntent.wantsCancellation
        ) {

            // ------------------------------------------------
            // 14A. Find appointment if it wasn't found yet
            // ------------------------------------------------

            if (
                !existingAppointment &&
                lead
            ) {

                existingAppointment =
                    await appointmentService
                        .getBookedAppointmentByLeadId(
                            lead.id
                        );

            }


            // ------------------------------------------------
            // 14B. No appointment found
            // ------------------------------------------------

            if (
                !existingAppointment
            ) {

                const cancellationResponse =
                    "I couldn't find a currently booked appointment for you. Please make sure you're using the phone number associated with your appointment.";


                await conversationService.addMessage(

                    conversation.id,

                    "ASSISTANT",

                    cancellationResponse

                );


                return res.status(200).json({

                    success: true,

                    data: {

                        conversationId:
                            conversation.id,

                        message:
                            cancellationResponse,

                        qualification,

                        cancellationIntent,

                        rescheduleIntent,

                        lead

                    }

                });

            }


            // ------------------------------------------------
            // 14C. Cancel appointment
            // ------------------------------------------------

            const cancelledAppointment =
                await appointmentService
                    .cancelAppointment(
                        existingAppointment.id
                    );


            // ------------------------------------------------
            // 14D. Deterministic cancellation confirmation
            // ------------------------------------------------

            const cancelledStart =
                DateTime.fromJSDate(
                    cancelledAppointment.startTime
                ).setZone(
                    BUSINESS_TIMEZONE
                );


            const cancelledEnd =
                DateTime.fromJSDate(
                    cancelledAppointment.endTime
                ).setZone(
                    BUSINESS_TIMEZONE
                );


            const cancellationConfirmation =
                `Your appointment has been cancelled successfully. It was scheduled for ${cancelledStart.toFormat("MMMM d, yyyy")} from ${cancelledStart.toFormat("h:mm a")} to ${cancelledEnd.toFormat("h:mm a")}. Your appointment ID is ${cancelledAppointment.id}.`;


            await conversationService.addMessage(

                conversation.id,

                "ASSISTANT",

                cancellationConfirmation

            );


            conversation =
                await conversationService
                    .getConversationById(
                        conversation.id
                    );


            return res.status(200).json({

                success: true,

                data: {

                    conversationId:
                        conversation.id,

                    message:
                        cancellationConfirmation,

                    qualification,

                    cancellationIntent,

                    rescheduleIntent,

                    lead:
                        cancelledAppointment.lead,

                    appointment:
                        cancelledAppointment

                }

            });

        }


        // ====================================================
        // 15. RESCHEDULE FLOW
        // ====================================================

        if (
            rescheduleIntent.wantsReschedule
        ) {

            // ------------------------------------------------
            // 15A. Find existing appointment by lead if
            //     phone lookup didn't already find it
            // ------------------------------------------------

            if (
                !existingAppointment &&
                lead
            ) {

                existingAppointment =
                    await appointmentService
                        .getBookedAppointmentByLeadId(
                            lead.id
                        );

            }


            // ------------------------------------------------
            // 15B. No existing appointment
            // ------------------------------------------------

            if (
                !existingAppointment
            ) {

                const noAppointmentResponse =
                    "I couldn't find a currently booked appointment for you to reschedule. Please provide the phone number associated with your appointment.";


                await conversationService.addMessage(

                    conversation.id,

                    "ASSISTANT",

                    noAppointmentResponse

                );


                return res.status(200).json({

                    success: true,

                    data: {

                        conversationId:
                            conversation.id,

                        message:
                            noAppointmentResponse,

                        qualification,

                        appointmentIntent,

                        bookingIntent,

                        cancellationIntent,

                        rescheduleIntent,

                        lead: null

                    }

                });

            }


            // ------------------------------------------------
            // 15C. New date/time required
            // ------------------------------------------------

            if (
                !validatedData.preferredDate ||
                !validatedData.preferredTime
            ) {

                const missingDateTimeResponse =
                    "Sure, I can help reschedule your appointment. What date and time would you like instead?";


                await conversationService.addMessage(

                    conversation.id,

                    "ASSISTANT",

                    missingDateTimeResponse

                );


                return res.status(200).json({

                    success: true,

                    data: {

                        conversationId:
                            conversation.id,

                        message:
                            missingDateTimeResponse,

                        qualification,

                        appointmentIntent,

                        bookingIntent,

                        cancellationIntent,

                        rescheduleIntent,

                        lead,

                        appointment:
                            existingAppointment

                    }

                });

            }


            // ------------------------------------------------
            // 15D. Check requested new slot
            // ------------------------------------------------

            const rescheduleAvailability =
                await checkRequestedSlot({

                    preferredDate:
                        validatedData.preferredDate,

                    preferredTime:
                        validatedData.preferredTime,

                    excludeAppointmentId:
                        existingAppointment.id

                });


            console.log(
                "RESCHEDULE AVAILABILITY:"
            );

            console.log(
                JSON.stringify(
                    rescheduleAvailability,
                    null,
                    2
                )
            );


            // ------------------------------------------------
            // 15E. Requested slot unavailable
            // ------------------------------------------------

            if (
                !rescheduleAvailability.available
            ) {

                const aiResponse =
                    await aiService
                        .generateAvailabilityResponse({

                            conversationMessages:
                                conversation.messages,

                            availability:
                                rescheduleAvailability,

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
                            "AI failed to generate reschedule availability response"
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

                        cancellationIntent,

                        rescheduleIntent,

                        availability:
                            rescheduleAvailability,

                        lead,

                        appointment:
                            existingAppointment

                    }

                });

            }


            // ------------------------------------------------
            // 15F. Build new appointment start/end
            // ------------------------------------------------

            const rescheduleStart =
                DateTime.fromISO(

                    `${validatedData.preferredDate}T${validatedData.preferredTime}`,

                    {
                        zone:
                            BUSINESS_TIMEZONE
                    }

                );


            if (
                !rescheduleStart.isValid
            ) {

                const error =
                    new Error(
                        "Unable to create a valid rescheduled appointment time"
                    );

                error.statusCode = 400;

                throw error;

            }


            const rescheduleEnd =
                rescheduleStart.plus({

                    hours:
                        SLOT_DURATION_HOURS

                });


            // ------------------------------------------------
            // 15G. Reschedule appointment
            // ------------------------------------------------

            let rescheduledAppointment;


            try {

                rescheduledAppointment =
                    await appointmentService
                        .rescheduleAppointment({

                            appointmentId:
                                existingAppointment.id,

                            startTime:
                                rescheduleStart.toISO(),

                            endTime:
                                rescheduleEnd.toISO()

                        });

            } catch (rescheduleError) {

                // --------------------------------------------
                // Slot became unavailable
                // --------------------------------------------

                if (
                    rescheduleError.statusCode === 409
                ) {

                    const latestAvailability =
                        await checkRequestedSlot({

                            preferredDate:
                                validatedData.preferredDate,

                            preferredTime:
                                validatedData.preferredTime,

                            excludeAppointmentId:
                                existingAppointment.id

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

                            cancellationIntent,

                            rescheduleIntent,

                            availability:
                                latestAvailability,

                            lead,

                            appointment:
                                existingAppointment

                        }

                    });

                }


                throw rescheduleError;

            }


            // ------------------------------------------------
            // 15H. Deterministic reschedule confirmation
            // ------------------------------------------------

            const updatedStart =
                DateTime.fromJSDate(
                    rescheduledAppointment.startTime
                ).setZone(
                    BUSINESS_TIMEZONE
                );


            const updatedEnd =
                DateTime.fromJSDate(
                    rescheduledAppointment.endTime
                ).setZone(
                    BUSINESS_TIMEZONE
                );


            const technicianName =
                rescheduledAppointment
                    .technician?.name ||
                "our technician";


            const rescheduleConfirmation =
                `Your appointment has been rescheduled successfully to ${updatedStart.toFormat("MMMM d, yyyy")} from ${updatedStart.toFormat("h:mm a")} to ${updatedEnd.toFormat("h:mm a")}. ${technicianName} has been assigned to your appointment. Your appointment ID is ${rescheduledAppointment.id}.`;


            await conversationService.addMessage(

                conversation.id,

                "ASSISTANT",

                rescheduleConfirmation

            );


            conversation =
                await conversationService
                    .getConversationById(
                        conversation.id
                    );


            return res.status(200).json({

                success: true,

                data: {

                    conversationId:
                        conversation.id,

                    message:
                        rescheduleConfirmation,

                    qualification,

                    appointmentIntent,

                    bookingIntent,

                    cancellationIntent,

                    rescheduleIntent,

                    availability:
                        rescheduleAvailability,

                    lead:
                        rescheduledAppointment.lead,

                    appointment:
                        rescheduledAppointment

                }

            });

        }


        // ====================================================
        // 16. NEW BOOKING CONFIRMATION FLOW
        // ====================================================

        if (
            bookingIntent.readyForBooking
        ) {

            // ------------------------------------------------
            // 16A. Qualified lead is mandatory
            // ------------------------------------------------

            if (
                !lead ||
                !qualification.qualified
            ) {

                const missingInformationResponse =
                    "Before I can book the appointment, I need to collect the remaining customer information. Please provide the requested details first.";


                await conversationService.addMessage(

                    conversation.id,

                    "ASSISTANT",

                    missingInformationResponse

                );


                return res.status(200).json({

                    success: true,

                    data: {

                        conversationId:
                            conversation.id,

                        message:
                            missingInformationResponse,

                        qualification,

                        appointmentIntent,

                        bookingIntent,

                        cancellationIntent,

                        rescheduleIntent,

                        lead

                    }

                });

            }


            // ------------------------------------------------
            // 16B. Re-check availability
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
            // 16C. Slot unavailable
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

                        cancellationIntent,

                        rescheduleIntent,

                        availability:
                            bookingAvailability,

                        lead

                    }

                });

            }


            // ------------------------------------------------
            // 16D. Build appointment times
            // ------------------------------------------------

            const start =
                DateTime.fromISO(

                    `${validatedData.preferredDate}T${validatedData.preferredTime}`,

                    {
                        zone:
                            BUSINESS_TIMEZONE
                    }

                );


            if (
                !start.isValid
            ) {

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
            // 16E. Create appointment
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

                            cancellationIntent,

                            rescheduleIntent,

                            availability:
                                latestAvailability,

                            lead

                        }

                    });

                }


                throw bookingError;

            }


            // ------------------------------------------------
            // 16F. Deterministic booking confirmation
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


            await conversationService.addMessage(

                conversation.id,

                "ASSISTANT",

                bookingConfirmation

            );


            conversation =
                await conversationService
                    .getConversationById(
                        conversation.id
                    );


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

                    cancellationIntent,

                    rescheduleIntent,

                    availability:
                        bookingAvailability,

                    lead:
                        appointment.lead,

                    appointment

                }

            });

        }


        // ====================================================
        // 17. NORMAL AVAILABILITY FLOW
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
        // 18. Generate normal AI response
        // ====================================================

        let aiResponse;


        if (
            appointmentIntent.readyForAvailabilityCheck &&
            qualification.qualified
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
        // 19. Validate AI response
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
        // 20. Save AI response
        // ----------------------------------------------------

        await conversationService.addMessage(

            conversation.id,

            "ASSISTANT",

            aiResponse.trim()

        );


        // ----------------------------------------------------
        // 21. Reload conversation
        // ----------------------------------------------------

        conversation =
            await conversationService
                .getConversationById(
                    conversation.id
                );


        // ----------------------------------------------------
        // 22. Return normal response
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

                cancellationIntent,

                rescheduleIntent,

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