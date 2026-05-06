import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const api = axios.create({
    baseURL: BASE_URL
});

// attach token to every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if(token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// handle token refresh on 401
api.interceptors.response.use(
    (response) => response, // success → return as is

    async (error) => {
        const original = error.config;

        // if 401 and not already retried
        if(error.response?.status === 401 && !original._retry) {
            original._retry = true;

            try {
                const refreshToken = localStorage.getItem("refreshToken");

                if(!refreshToken) {
                    // no refresh token → logout
                    localStorage.clear();
                    window.location.href = "/admin/login";
                    return Promise.reject(error);
                }

                // get new access token
                const res = await axios.post(`${BASE_URL}/api/auth/refresh`, {
                    refreshToken
                });

                const newToken = res.data.accessToken;
                const newRefresh = res.data.refreshToken;

                // save new tokens
                localStorage.setItem("token", newToken);
                localStorage.setItem("refreshToken", newRefresh);

                // retry original request with new token
                original.headers.Authorization = `Bearer ${newToken}`;
                return api(original);

            } catch(err) {
                // refresh failed → logout
                localStorage.clear();
                window.location.href = "/admin/login";
                return Promise.reject(err);
            }
        }

        return Promise.reject(error);
    }
);

export default api;