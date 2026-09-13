const getAppointmentIntent = (leadData) => {
    if (!leadData.wantsAppointment) {
        return {
            wantsAppointment: false,
            readyForAvailabilityCheck: false,
            missingFields: []
        };
    }

    const missingFields = [];

    if (!leadData.preferredDate) {
        missingFields.push("preferredDate");
    }

    if (!leadData.preferredTime) {
        missingFields.push("preferredTime");
    }

    return {
        wantsAppointment: true,
        readyForAvailabilityCheck: missingFields.length === 0,
        missingFields
    };
};

module.exports = {
    getAppointmentIntent
};