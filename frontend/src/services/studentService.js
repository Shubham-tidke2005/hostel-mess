import api from "./api";

// Get all students
export const getStudents = () => {
    return api.get("/students/");
};

// Get one student
export const getStudent = (id) => {
    return api.get(`/students/${id}/`);
};

// Create student
export const createStudent = (data) => {
    return api.post("/students/", data);
};

// Update student
export const updateStudent = (id, data) => {
    return api.put(`/students/${id}/`, data);
};

// Delete student
export const deleteStudent = (id) => {
    return api.delete(`/students/${id}/`);
};