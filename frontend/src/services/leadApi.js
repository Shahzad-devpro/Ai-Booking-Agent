
const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL ||
    "http://localhost:5000/api";


const getAuthHeaders = () => {
    const token =
        localStorage.getItem("authToken");

    if (!token) {
        throw new Error(
            "Authentication token is missing"
        );
    }

    return {
        Authorization: `Bearer ${token}`,
    };
};


const getLeads = async ({
    status,
    urgency,
    page = 1,
    limit = 10,
} = {}) => {

    const params =
        new URLSearchParams();

    params.set("page", page);
    params.set("limit", limit);

    if (status) {
        params.set("status", status);
    }

    if (urgency) {
        params.set("urgency", urgency);
    }

    const response =
        await fetch(
            `${API_BASE_URL}/leads?${params.toString()}`,
            {
                method: "GET",
                headers: {
                    ...getAuthHeaders(),
                },
            }
        );

    const data =
        await response.json();

    if (!response.ok) {

        if (response.status === 401) {
            localStorage.removeItem("authToken");
            localStorage.removeItem("authUser");
        }

        throw new Error(
            data.message ||
            "Failed to fetch leads"
        );
    }

    return data;
};


const getLeadById = async (leadId) => {

    if (!leadId) {
        throw new Error(
            "Lead ID is required"
        );
    }

    const response =
        await fetch(
            `${API_BASE_URL}/leads/${leadId}`,
            {
                method: "GET",
                headers: {
                    ...getAuthHeaders(),
                },
            }
        );

    const data =
        await response.json();

    if (!response.ok) {

        if (response.status === 401) {
            localStorage.removeItem("authToken");
            localStorage.removeItem("authUser");
        }

        throw new Error(
            data.message ||
            "Failed to fetch lead"
        );
    }

    return data;
};


const updateLeadStatus = async (
    leadId,
    status
) => {

    if (!leadId) {
        throw new Error(
            "Lead ID is required"
        );
    }

    if (!status) {
        throw new Error(
            "Lead status is required"
        );
    }

    const response =
        await fetch(
            `${API_BASE_URL}/leads/${leadId}/status`,
            {
                method: "PATCH",

                headers: {
                    "Content-Type":
                        "application/json",
                    ...getAuthHeaders(),
                },

                body: JSON.stringify({
                    status,
                }),
            }
        );

    const data =
        await response.json();

    if (!response.ok) {

        if (response.status === 401) {
            localStorage.removeItem("authToken");
            localStorage.removeItem("authUser");
        }

        throw new Error(
            data.message ||
            "Failed to update lead status"
        );
    }

    return data;
};


export {
    getLeads,
    getLeadById,
    updateLeadStatus,
};

