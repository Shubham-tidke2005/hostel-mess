import api from "./api";

// Get all rooms
export const getRooms = async () => {
    const response = await api.get("/rooms/");
    return response.data;
};

// Get single room
export const getRoom = async (id) => {
    const response = await api.get(`/rooms/${id}/`);
    return response.data;
};

// Create room
export const createRoom = async (roomData) => {
    const response = await api.post("/rooms/", roomData);
    return response.data;
};

// Update room
export const updateRoom = async (id, roomData) => {
    const response = await api.patch(
        `/rooms/${id}/`,
        roomData
    );
    return response.data;
};

// Delete room
export const deleteRoom = async (id) => {
    const response = await api.delete(`/rooms/${id}/`);
    return response.data;
};