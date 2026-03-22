import axios from "axios";

const API_URL = "http://localhost:8070/api/notices";

export const getNotices = () => axios.get(API_URL);
export const getNotice = (id) => axios.get(`${API_URL}/${id}`);
export const addNotice = (data) => axios.post(API_URL, data);
export const updateNotice = (id, data) => axios.put(`${API_URL}/${id}`, data);
export const deleteNotice = (id) => axios.delete(`${API_URL}/${id}`);
