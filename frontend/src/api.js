import axios from "axios";

// Base URL can be configured via Vite env VITE_API_URL
const API_URL = import.meta.env.VITE_API_URL;

import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
});

export const setAuthToken = (token) => {
    if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
        delete api.defaults.headers.common["Authorization"];
    }
};

export const register = (payload) => api.post("/auth/register", payload);
export const login = (payload) => api.post("/auth/login", payload);
export const fetchHabits = () => api.get("/habits");
export const addHabit = (name) => api.post("/habits", { name });
export const toggleHabit = (id) => api.put(`/habits/${id}`);
export const deleteHabit = (id) => api.delete(`/habits/${id}`);

export default api;
