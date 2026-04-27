import axios from "axios";

const API_URL = "http://localhost:8070/api/dashboard";

export const getDashboardSummary = () => axios.get(`${API_URL}/summary`);
