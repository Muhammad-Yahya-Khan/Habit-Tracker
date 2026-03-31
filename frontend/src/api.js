import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

export const setAuthToken = (token) => {
    if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
        delete api.defaults.headers.common["Authorization"];
    }
};

export const apiRegister = (data) => api.post("/auth/register", data);
export const apiLogin = (data) => api.post("/auth/login", data);
export const apiFetchHabits = () => api.get("/habits");
export const apiAddHabit = (name) => api.post("/habits", { name });
export const apiToggleHabit = (id) => api.put(`/habits/${id}`);
export const apiDeleteHabit = (id) => api.delete(`/habits/${id}`);

export default api;
