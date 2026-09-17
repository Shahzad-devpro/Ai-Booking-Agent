const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL ||
    "http://localhost:5000/api";


// ============================================================
// AUTH
// ============================================================

const getAuthHeaders = () => {

    const token =
        localStorage.getItem("authToken");

    return {
        Authorization:
            `Bearer ${token}`
    };
};


// ============================================================
// RESPONSE HELPER
// ============================================================

const parseResponse =
    async response => {

        let data = null;

        try {

            data =
                await response.json();

        } catch {

            data = null;

        }


        if (!response.ok) {

            throw new Error(
                data?.message ||
                "Request failed"
            );

        }


        return data;
    };


// ============================================================
// GET APPOINTMENTS
// ============================================================

const getAppointments =
    async ({
        search = "",
        status = "",
        technicianId = "",
        date = "",
        page = 1,
        limit = 10
    } = {}) => {

        const params =
            new URLSearchParams();


        params.set(
            "page",
            String(page)
        );


        params.set(
            "limit",
            String(limit)
        );


        if (
            typeof search === "string" &&
            search.trim()
        ) {

            params.set(
                "search",
                search.trim()
            );

        }


        if (status) {

            params.set(
                "status",
                status
            );

        }


        if (technicianId) {

            params.set(
                "technicianId",
                technicianId
            );

        }


        if (date) {

            params.set(
                "date",
                date
            );

        }


        const response =
            await fetch(
                `${API_BASE_URL}/appointments?${params.toString()}`,
                {
                    method: "GET",

                    headers:
                        getAuthHeaders()
                }
            );


        return parseResponse(
            response
        );
    };


// ============================================================
// GET APPOINTMENT BY ID
// ============================================================

const getAppointmentById =
    async appointmentId => {

        if (!appointmentId) {

            throw new Error(
                "Appointment ID is required"
            );

        }


        const response =
            await fetch(
                `${API_BASE_URL}/appointments/${appointmentId}`,
                {
                    method: "GET",

                    headers:
                        getAuthHeaders()
                }
            );


        return parseResponse(
            response
        );
    };


// ============================================================
// GET ACTIVE TECHNICIANS
// ============================================================

const getTechnicians =
    async () => {

        const response =
            await fetch(
                `${API_BASE_URL}/appointments/technicians`,
                {
                    method: "GET",

                    headers:
                        getAuthHeaders()
                }
            );


        return parseResponse(
            response
        );
    };


// ============================================================
// GET AVAILABLE SLOTS
// ============================================================

const getAvailableSlots =
    async date => {

        if (!date) {

            throw new Error(
                "Date is required"
            );

        }


        const params =
            new URLSearchParams();

        params.set(
            "date",
            date
        );


        const response =
            await fetch(
                `${API_BASE_URL}/appointments/availability?${params.toString()}`,
                {
                    method: "GET",

                    headers:
                        getAuthHeaders()
                }
            );


        return parseResponse(
            response
        );
    };


// ============================================================
// CANCEL
// ============================================================

const cancelAppointment =
    async appointmentId => {

        if (!appointmentId) {

            throw new Error(
                "Appointment ID is required"
            );

        }


        const response =
            await fetch(
                `${API_BASE_URL}/appointments/${appointmentId}/cancel`,
                {
                    method: "PATCH",

                    headers:
                        getAuthHeaders()
                }
            );


        return parseResponse(
            response
        );
    };


// ============================================================
// RESCHEDULE
// ============================================================

const rescheduleAppointment =
    async ({
        appointmentId,
        startTime,
        endTime
    }) => {

        if (!appointmentId) {

            throw new Error(
                "Appointment ID is required"
            );

        }


        if (!startTime || !endTime) {

            throw new Error(
                "Start time and end time are required"
            );

        }


        const response =
            await fetch(
                `${API_BASE_URL}/appointments/${appointmentId}/reschedule`,
                {
                    method: "PATCH",

                    headers: {
                        ...getAuthHeaders(),

                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({
                            startTime,
                            endTime
                        })
                }
            );


        return parseResponse(
            response
        );
    };


// ============================================================
// MANUAL TECHNICIAN ASSIGNMENT
// ============================================================

const assignTechnician =
    async ({
        appointmentId,
        technicianId
    }) => {

        if (!appointmentId) {

            throw new Error(
                "Appointment ID is required"
            );

        }


        if (!technicianId) {

            throw new Error(
                "Technician ID is required"
            );

        }


        const response =
            await fetch(
                `${API_BASE_URL}/appointments/${appointmentId}/technician`,
                {
                    method: "PATCH",

                    headers: {
                        ...getAuthHeaders(),

                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({
                            technicianId
                        })
                }
            );


        return parseResponse(
            response
        );
    };


export {
    getAppointments,
    getAppointmentById,
    getTechnicians,
    getAvailableSlots,
    cancelAppointment,
    rescheduleAppointment,
    assignTechnician
};