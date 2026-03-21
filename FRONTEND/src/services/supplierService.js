import axios from "axios";

const API_URL = "http://localhost:8070/api/suppliers";

export const getSuppliers = () => axios.get(API_URL);
export const getSupplier = (id) => axios.get(`${API_URL}/${id}`);
export const addSupplier = (supplierData) => axios.post(API_URL, supplierData);
export const updateSupplier = (id, supplierData) => axios.put(`${API_URL}/${id}`, supplierData);
export const deleteSupplier = (id) => axios.delete(`${API_URL}/${id}`);
