import api from "./api";

// Get all bookings
export const getBookings = async () => {
    const response = await api.get("/bookings/");
    return response.data;
};

// Get single booking
export const getBooking = async (id) => {
    const response = await api.get(`/bookings/${id}/`);
    return response.data;
};

// Create booking
export const createBooking = async (bookingData) => {
    const response = await api.post(
        "/bookings/",
        bookingData
    );
    return response.data;
};

// Update booking
export const updateBooking = async (id, bookingData) => {
    const response = await api.patch(
        `/bookings/${id}/`,
        bookingData
    );
    return response.data;
};

// Request cancellation
export const requestCancellation = async (id) => {
    const response = await api.patch(
        `/bookings/${id}/`,
        {
            status: "Cancellation Requested",
        }
    );
    return response.data;
};

// Approve booking
export const approveBooking = async (id, remarks = "") => {
    const response = await api.patch(
        `/bookings/${id}/`,
        {
            status: "Approved",
            remarks,
        }
    );
    return response.data;
};

// Reject booking
export const rejectBooking = async (id, remarks = "") => {
    const response = await api.patch(
        `/bookings/${id}/`,
        {
            status: "Rejected",
            remarks,
        }
    );
    return response.data;
};

// Cancel booking
export const cancelBooking = async (id, remarks = "") => {
    const response = await api.patch(
        `/bookings/${id}/`,
        {
            status: "Cancelled",
            remarks,
        }
    );
    return response.data;
};