import axios from "axios";

// Change this to your backend API
const API_URL = "http://localhost:8070/api/members";

// Get all members
export const getMembers = () => axios.get(API_URL);

// Get one member by ID
export const getMember = (id) => axios.get(`${API_URL}/${id}`);

// Add a new member
export const addMember = (memberData) => axios.post(API_URL, memberData);

// Update a member
export const updateMember = (id, memberData) => axios.put(`${API_URL}/${id}`, memberData);

// Delete a member
export const deleteMember = (id) => axios.delete(`${API_URL}/${id}`);
