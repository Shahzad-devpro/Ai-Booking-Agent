const ALLOWED_SERVICES = [
    "AC_REPAIR",
    "AC_INSTALLATION",
    "HEATING_REPAIR",
    "HEATING_INSTALLATION",
    "HVAC_MAINTENANCE",
    "OTHER"
];

const ALLOWED_URGENCY = [
    "LOW",
    "NORMAL",
    "HIGH",
    "EMERGENCY"
];

const normalizeNull = (value) => {
    if (
        value === null ||
        value === undefined ||
        value === "null" ||
        value === "NULL"
    ) {
        return null;
    }

    return value;
};

const validateExtractedLeadData = (data) => {

    if (!data || typeof data !== "object") {
        const error = new Error(
            "Invalid extracted lead data"
        );

        error.statusCode = 502;
        throw error;
    }

    if (!data.customer || typeof data.customer !== "object") {
        const error = new Error(
            "Invalid customer data"
        );

        error.statusCode = 502;
        throw error;
    }

    // Normalize nullable fields
    data.customer.name =
        normalizeNull(data.customer.name);

    data.customer.phone =
        normalizeNull(data.customer.phone);

    data.customer.email =
        normalizeNull(data.customer.email);

    data.customer.address =
        normalizeNull(data.customer.address);

    data.service =
        normalizeNull(data.service);

    data.problemDescription =
        normalizeNull(data.problemDescription);

    data.urgency =
        normalizeNull(data.urgency);

    data.preferredDate =
        normalizeNull(data.preferredDate);

    data.preferredTime =
        normalizeNull(data.preferredTime);

    if (
        data.service !== null &&
        !ALLOWED_SERVICES.includes(data.service)
    ) {
        const error = new Error(
            "AI returned an invalid service"
        );

        error.statusCode = 502;
        throw error;
    }

    if (
        data.urgency !== null &&
        !ALLOWED_URGENCY.includes(data.urgency)
    ) {
        const error = new Error(
            "AI returned an invalid urgency"
        );

        error.statusCode = 502;
        throw error;
    }

    if (typeof data.wantsAppointment !== "boolean") {
        const error = new Error(
            "AI returned an invalid appointment preference"
        );

        error.statusCode = 502;
        throw error;
    }

    return data;
};

module.exports = {
    validateExtractedLeadData
};