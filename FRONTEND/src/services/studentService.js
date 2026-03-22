import axios from "axios";

// Change this to your backend API
const API_URL = "http://localhost:8070/api/students";

// Get all students
export const getStudents = () => axios.get(API_URL);

// Get one student by ID
export const getStudent = (id) => axios.get(`${API_URL}/${id}`);

// Add a new student
export const addStudent = (studentData) => axios.post(API_URL, studentData);

// Update a student
export const updateStudent = (id, studentData) => axios.put(`${API_URL}/${id}`, studentData);

// Delete a student
export const deleteStudent = (id) => axios.delete(`${API_URL}/${id}`);
