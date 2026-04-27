import axios from 'axios';

const API_URL = "http://localhost:8070/api/auditLogs";

export const getAuditLogs = async () => {
    return await axios.get(API_URL);
};

export const createAuditLog = async (logData) => {
    return await axios.post(API_URL, logData);
};
