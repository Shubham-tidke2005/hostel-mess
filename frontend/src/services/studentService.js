
import api from "./api";

/**
 * Get all students
 */
export const getStudents = async () => {
    const response = await api.get("/students/");
    return response.data;
};

/**
 * Get a single student
 */
export const getStudent = async (id) => {
    const response = await api.get(`/students/${id}/`);
    return response.data;
};

/**
 * Create a new student
 *
 * FormData is supported so profile_image
 * can be uploaded.
 */
export const createStudent = async (studentData) => {
    const response = await api.post(
        "/students/",
        studentData
    );

    return response.data;
};

/**
 * Update an existing student
 *
 * PATCH is used because the edit form
 * may update only selected fields.
 */
export const updateStudent = async (id, studentData) => {
    const response = await api.patch(
        `/students/${id}/`,
        studentData
    );

    return response.data;
};

/**
 * Delete a student
 */
export const deleteStudent = async (id) => {
    const response = await api.delete(
        `/students/${id}/`
    );

    return response.data;
};

