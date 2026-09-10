import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import ChangePasswordForm from "../../components/profile/ChangePasswordForm";
import { changePassword } from "../../services/profileService";

function ChangePassword() {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    // ==========================================
    // Change Password
    // ==========================================
    const handleSubmit = async (passwordData) => {
        try {
            setLoading(true);

            await changePassword(passwordData);

            toast.success("Password changed successfully.");

            navigate("/profile");
        } catch (err) {
            console.error(
                "Change Password Error:",
                err
            );

            const responseData = err?.response?.data;

            if (
                responseData &&
                typeof responseData === "object"
            ) {
                if (responseData.detail) {
                    toast.error(responseData.detail);
                } else if (responseData.current_password) {
                    toast.error(
                        Array.isArray(
                            responseData.current_password
                        )
                            ? responseData.current_password[0]
                            : responseData.current_password
                    );
                } else if (responseData.new_password) {
                    toast.error(
                        Array.isArray(
                            responseData.new_password
                        )
                            ? responseData.new_password[0]
                            : responseData.new_password
                    );
                } else {
                    const firstError =
                        Object.values(responseData)[0];

                    toast.error(
                        Array.isArray(firstError)
                            ? firstError[0]
                            : String(firstError)
                    );
                }
            } else {
                toast.error(
                    "Unable to change password."
                );
            }

            throw err;
        } finally {
            setLoading(false);
        }
    };

    return (
        <ChangePasswordForm
            onSubmit={handleSubmit}
            loading={loading}
        />
    );
}

export default ChangePassword;