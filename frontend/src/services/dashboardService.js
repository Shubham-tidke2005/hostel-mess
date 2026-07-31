import api from "./api";

export const getDashboardStats = async () => {
    const [
        students,
        hostels,
        rooms,
        bookings,
        mess,
    ] = await Promise.all([
        api.get("/students/"),
        api.get("/hostels/"),
        api.get("/rooms/"),
        api.get("/bookings/"),
        api.get("/mess/"),
    ]);

    return {
        students: students.data,
        hostels: hostels.data,
        rooms: rooms.data,
        bookings: bookings.data,
        mess: mess.data,
    };
};