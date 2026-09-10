import api from "./api";

// ==========================================
// Get logged-in student's profile
// ==========================================
export const getProfile = async () => {
    const response = await api.get("/students/me/");
    return response.data;
};

// ==========================================
// Update logged-in student's profile
// Supports profile image upload
// ==========================================
export const updateProfile = async (profileData) => {
    const formData = new FormData();

    Object.entries(profileData).forEach(([key, value]) => {
        // Only append values that are provided
        if (value !== undefined && value !== null) {
            formData.append(key, value);
        }
    });

    const response = await api.patch(
        "/students/me/",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return response.data;
};

// ==========================================
// Change password
// ==========================================
export const changePassword = async (passwordData) => {
    const response = await api.post(
        "/auth/change-password/",
        passwordData
    );

    return response.data;
};