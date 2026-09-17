const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL ||
    "http://localhost:5000/api";


const getAuthHeaders = () => {

    const token =
        localStorage.getItem(
            "authToken"
        );

    return {
        Authorization:
            `Bearer ${token}`
    };
};


const parseResponse =
    async (response) => {

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


const getCustomers =
    async ({
        search = "",
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

        if (search.trim()) {

            params.set(
                "search",
                search.trim()
            );
        }

        const response =
            await fetch(
                `${API_BASE_URL}/customers?${params.toString()}`,
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


const getCustomerById =
    async (customerId) => {

        if (!customerId) {

            throw new Error(
                "Customer ID is required"
            );
        }

        const response =
            await fetch(
                `${API_BASE_URL}/customers/${customerId}`,
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


export {
    getCustomers,
    getCustomerById
};