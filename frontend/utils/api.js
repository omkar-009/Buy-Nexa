import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

// Response interceptor for token refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If 401 and not already retrying
        if (error.response?.status === 401 && !originalRequest._retry) {
            // Check if it's a token expired error (optional: check a specific code/message from backend)
            originalRequest._retry = true;

            try {
                // Attempt to refresh token
                await axios.post(
                    'http://localhost:5000/api/user/refresh-token',
                    {},
                    { withCredentials: true }
                );

                // Retry original request
                return api(originalRequest);
            } catch (refreshError) {
                // Refresh failed, redirect to login or clear store
                console.error('Token refresh failed:', refreshError);
                // Clear sensitive data on frontend
                if (typeof window !== 'undefined' && window.location.pathname !== '/home') {
                    window.location.href = '/home';
                }
            }
        }

        return Promise.reject(error);
    }
);

export default api;
