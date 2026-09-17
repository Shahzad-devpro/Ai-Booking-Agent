const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL ||
    "http://localhost:5000/api";


const getAuthHeaders = () => {

    return {
        Authorization:
            `Bearer ${localStorage.getItem("authToken")}`
    };
};


const getTechnicians =
    async () => {

        const response =
            await fetch(
                `${API_BASE_URL}/technicians`,
                {
                    method: "GET",
                    headers:
                        getAuthHeaders()
                }
            );


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
                "Failed to fetch technicians"
            );
        }


        return data;
};


export {
    getTechnicians
};