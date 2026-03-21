import axios from "axios";

const API_URL = "http://localhost:8070/api/transactions";

export const getTransactions = () => axios.get(API_URL);
export const getTransaction = (id) => axios.get(`${API_URL}/${id}`);
export const issueBook = (data) => axios.post(API_URL, data);
export const updateTransaction = (id, data) => axios.put(`${API_URL}/${id}`, data);
export const returnBook = (id, fine = 0) => axios.post(`${API_URL}/return/${id}`, { fine });
export const deleteTransaction = (id) => axios.delete(`${API_URL}/${id}`);
