
import api from "./api";

// Get all hostels
export const getHostels = async () => {
    const response = await api.get("/hostels/");
    return response.data;
};

// Get single hostel
export const getHostel = async (id) => {
    const response = await api.get(`/hostels/${id}/`);
    return response.data;
};

// Create hostel
export const createHostel = async (hostelData) => {
    const response = await api.post("/hostels/", hostelData);
    return response.data;
};

// Update hostel
export const updateHostel = async (id, hostelData) => {
    const response = await api.patch(
        `/hostels/${id}/`,
        hostelData
    );
    return response.data;
};

// Delete hostel
export const deleteHostel = async (id) => {
    const response = await api.delete(`/hostels/${id}/`);
    return response.data;
};

