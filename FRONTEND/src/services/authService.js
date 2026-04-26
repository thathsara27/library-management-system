import axios from "axios";

const API_URL = "http://localhost:8070/api/auth";

export const registerStaff = async (data) => {
    const res = await axios.post(`${API_URL}/register`, data);
    if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
    }
    return res.data;
};

export const loginStaff = async (email, password) => {
    const res = await axios.post(`${API_URL}/login`, { email, password });
    if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
    }
    return res.data;
};

export const registerStudent = async (data) => {
    const res = await axios.post(`${API_URL}/student/register`, data);
    if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
    }
    return res.data;
};

export const loginStudent = async (email, password) => {
    const res = await axios.post(`${API_URL}/student/login`, { email, password });
    if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
    }
    return res.data;
};

export const logoutStaff = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
};

export const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem("user"));
};

// Set token for all future axios requests (Optional but good practice)
export const setupAxiosInterceptors = () => {
    axios.interceptors.request.use(config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    });
};

export const changePassword = async (email, currentPassword, newPassword) => {
    const res = await axios.post(`${API_URL}/change-password`, { email, currentPassword, newPassword });
    return res.data;
};
