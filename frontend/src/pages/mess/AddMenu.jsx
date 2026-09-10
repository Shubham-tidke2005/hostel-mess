import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import MenuForm from "../../components/mess/MenuForm";
import { createMenu } from "../../services/messService";

function AddMenu() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (menuData) => {
        try {
            setLoading(true);

            await createMenu(menuData);

            toast.success("Mess menu added successfully.");

            navigate("/mess");
        } catch (error) {
            console.error("Failed to create mess menu:", error);

            const responseData = error?.response?.data;

            // Handle Django/DRF validation errors
            if (responseData && typeof responseData === "object") {
                if (responseData.menu_date) {
                    toast.error(
                        Array.isArray(responseData.menu_date)
                            ? responseData.menu_date[0]
                            : responseData.menu_date
                    );
                } else if (responseData.detail) {
                    toast.error(responseData.detail);
                } else {
                    const firstError = Object.values(responseData)[0];

                    toast.error(
                        Array.isArray(firstError)
                            ? firstError[0]
                            : String(firstError)
                    );
                }
            } else {
                toast.error("Failed to add mess menu.");
            }

            // Re-throw so MenuForm can also handle unexpected errors.
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return (
        <MenuForm
            onSubmit={handleSubmit}
            loading={loading}
        />
    );
}

export default AddMenu;