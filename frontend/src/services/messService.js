import api from "./api";

// Get all menus
export const getMenus = async () => {
    const response = await api.get("/mess/");
    return response.data;
};

// Get single menu
export const getMenu = async (id) => {
    const response = await api.get(`/mess/${id}/`);
    return response.data;
};

// Create menu
export const createMenu = async (menuData) => {
    const response = await api.post(
        "/mess/",
        menuData
    );
    return response.data;
};

// Update menu
export const updateMenu = async (id, menuData) => {
    const response = await api.patch(
        `/mess/${id}/`,
        menuData
    );
    return response.data;
};

// Delete menu
export const deleteMenu = async (id) => {
    const response = await api.delete(
        `/mess/${id}/`
    );
    return response.data;
};