import { useEffect, useState } from "react";

const EMPTY_FORM = {
    hostel: "",
    room_number: "",
    floor: "",
    capacity: "",
    occupied_beds: "0",
    status: "Available",
};

function RoomForm({
    initialData = null,
    hostels = [],
    onSubmit,
    submitting = false,
    submitLabel = "Save Room",
}) {
    const [formData, setFormData] = useState(EMPTY_FORM);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (!initialData) {
            setFormData(EMPTY_FORM);
            setErrors({});
            return;
        }

        setFormData({
            hostel:
                typeof initialData.hostel === "object"
                    ? initialData.hostel?.id ?? ""
                    : initialData.hostel ?? "",
            room_number: initialData.room_number ?? "",
            floor: initialData.floor ?? "",
            capacity: initialData.capacity ?? "",
            occupied_beds: initialData.occupied_beds ?? "0",
            status: initialData.status ?? "Available",
        });

        setErrors({});
    }, [initialData]);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        setErrors((prev) => ({
            ...prev,
            [name]: "",
        }));
    };

    const availableBeds = Math.max(
        Number(formData.capacity || 0) -
            Number(formData.occupied_beds || 0),
        0
    );

    const validate = () => {
        const newErrors = {};

        if (!formData.hostel) {
            newErrors.hostel = "Please select a hostel.";
        }

        if (!String(formData.room_number).trim()) {
            newErrors.room_number = "Room number is required.";
        }

        if (formData.floor === "") {
            newErrors.floor = "Floor is required.";
        } else if (
            !Number.isInteger(Number(formData.floor)) ||
            Number(formData.floor) < 0
        ) {
            newErrors.floor =
                "Floor must be a valid whole number.";
        }

        if (formData.capacity === "") {
            newErrors.capacity = "Capacity is required.";
        } else if (
            !Number.isInteger(Number(formData.capacity)) ||
            Number(formData.capacity) <= 0
        ) {
            newErrors.capacity =
                "Capacity must be a whole number greater than 0.";
        }

        if (formData.occupied_beds === "") {
            newErrors.occupied_beds =
                "Occupied beds are required.";
        } else if (
            !Number.isInteger(Number(formData.occupied_beds)) ||
            Number(formData.occupied_beds) < 0
        ) {
            newErrors.occupied_beds =
                "Occupied beds must be 0 or greater.";
        } else if (
            Number(formData.capacity) > 0 &&
            Number(formData.occupied_beds) >
                Number(formData.capacity)
        ) {
            newErrors.occupied_beds =
                "Occupied beds cannot exceed room capacity.";
        }

        if (!formData.status) {
            newErrors.status = "Please select room status.";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validate()) {
            return;
        }

        const roomData = {
            hostel: Number(formData.hostel),
            room_number: String(formData.room_number).trim(),
            floor: Number(formData.floor),
            capacity: Number(formData.capacity),
            occupied_beds: Number(formData.occupied_beds),
            status: formData.status,
        };

        await onSubmit(roomData);
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-6"
        >
            {/* Hostel */}
            <div>
                <label
                    htmlFor="hostel"
                    className="mb-2 block text-sm font-medium text-[#1A1A1A]"
                >
                    Hostel
                </label>

                <select
                    id="hostel"
                    name="hostel"
                    value={formData.hostel}
                    onChange={handleChange}
                    disabled={submitting}
                    className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-[#1A1A1A] outline-none transition focus:ring-2 ${
                        errors.hostel
                            ? "border-red-400 focus:ring-red-100"
                            : "border-slate-200 focus:border-[#2563EB] focus:ring-blue-100"
                    }`}
                >
                    <option value="">
                        Select hostel
                    </option>

                    {hostels.map((hostel) => (
                        <option
                            key={hostel.id}
                            value={hostel.id}
                        >
                            {hostel.hostel_name}
                        </option>
                    ))}
                </select>

                {errors.hostel && (
                    <p className="mt-1.5 text-sm text-red-600">
                        {errors.hostel}
                    </p>
                )}
            </div>

            {/* Room Number */}
            <div>
                <label
                    htmlFor="room_number"
                    className="mb-2 block text-sm font-medium text-[#1A1A1A]"
                >
                    Room Number
                </label>

                <input
                    id="room_number"
                    name="room_number"
                    type="text"
                    value={formData.room_number}
                    onChange={handleChange}
                    placeholder="e.g. 101"
                    disabled={submitting}
                    className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-[#1A1A1A] outline-none transition placeholder:text-slate-400 focus:ring-2 ${
                        errors.room_number
                            ? "border-red-400 focus:ring-red-100"
                            : "border-slate-200 focus:border-[#2563EB] focus:ring-blue-100"
                    }`}
                />

                {errors.room_number && (
                    <p className="mt-1.5 text-sm text-red-600">
                        {errors.room_number}
                    </p>
                )}
            </div>

            {/* Floor + Capacity */}
            <div className="grid gap-6 sm:grid-cols-2">
                <div>
                    <label
                        htmlFor="floor"
                        className="mb-2 block text-sm font-medium text-[#1A1A1A]"
                    >
                        Floor
                    </label>

                    <input
                        id="floor"
                        name="floor"
                        type="number"
                        min="0"
                        step="1"
                        value={formData.floor}
                        onChange={handleChange}
                        placeholder="e.g. 1"
                        disabled={submitting}
                        className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-[#1A1A1A] outline-none transition placeholder:text-slate-400 focus:ring-2 ${
                            errors.floor
                                ? "border-red-400 focus:ring-red-100"
                                : "border-slate-200 focus:border-[#2563EB] focus:ring-blue-100"
                        }`}
                    />

                    {errors.floor && (
                        <p className="mt-1.5 text-sm text-red-600">
                            {errors.floor}
                        </p>
                    )}
                </div>

                <div>
                    <label
                        htmlFor="capacity"
                        className="mb-2 block text-sm font-medium text-[#1A1A1A]"
                    >
                        Capacity
                    </label>

                    <input
                        id="capacity"
                        name="capacity"
                        type="number"
                        min="1"
                        step="1"
                        value={formData.capacity}
                        onChange={handleChange}
                        placeholder="e.g. 4"
                        disabled={submitting}
                        className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-[#1A1A1A] outline-none transition placeholder:text-slate-400 focus:ring-2 ${
                            errors.capacity
                                ? "border-red-400 focus:ring-red-100"
                                : "border-slate-200 focus:border-[#2563EB] focus:ring-blue-100"
                        }`}
                    />

                    {errors.capacity && (
                        <p className="mt-1.5 text-sm text-red-600">
                            {errors.capacity}
                        </p>
                    )}
                </div>
            </div>

            {/* Occupied Beds + Status */}
            <div className="grid gap-6 sm:grid-cols-2">
                <div>
                    <label
                        htmlFor="occupied_beds"
                        className="mb-2 block text-sm font-medium text-[#1A1A1A]"
                    >
                        Occupied Beds
                    </label>

                    <input
                        id="occupied_beds"
                        name="occupied_beds"
                        type="number"
                        min="0"
                        step="1"
                        value={formData.occupied_beds}
                        onChange={handleChange}
                        placeholder="e.g. 3"
                        disabled={submitting}
                        className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-[#1A1A1A] outline-none transition placeholder:text-slate-400 focus:ring-2 ${
                            errors.occupied_beds
                                ? "border-red-400 focus:ring-red-100"
                                : "border-slate-200 focus:border-[#2563EB] focus:ring-blue-100"
                        }`}
                    />

                    {errors.occupied_beds && (
                        <p className="mt-1.5 text-sm text-red-600">
                            {errors.occupied_beds}
                        </p>
                    )}
                </div>

                <div>
                    <label
                        htmlFor="status"
                        className="mb-2 block text-sm font-medium text-[#1A1A1A]"
                    >
                        Status
                    </label>

                    <select
                        id="status"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        disabled={submitting}
                        className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-[#1A1A1A] outline-none transition focus:ring-2 ${
                            errors.status
                                ? "border-red-400 focus:ring-red-100"
                                : "border-slate-200 focus:border-[#2563EB] focus:ring-blue-100"
                        }`}
                    >
                        <option value="Available">
                            Available
                        </option>
                        <option value="Full">
                            Full
                        </option>
                        <option value="Maintenance">
                            Maintenance
                        </option>
                    </select>

                    {errors.status && (
                        <p className="mt-1.5 text-sm text-red-600">
                            {errors.status}
                        </p>
                    )}
                </div>
            </div>

            {/* Available Beds */}
            <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
                <p className="text-sm font-medium text-blue-700">
                    Available Beds
                </p>

                <p className="mt-1 text-3xl font-bold text-[#2563EB]">
                    {availableBeds}
                </p>

                <p className="mt-1 text-xs text-blue-600">
                    Capacity − Occupied Beds
                </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                <button
                    type="button"
                    onClick={() => window.history.back()}
                    disabled={submitting}
                    className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-[#1A1A1A] transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    disabled={submitting}
                    className="rounded-xl bg-[#2563EB] px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {submitting ? "Saving..." : submitLabel}
                </button>
            </div>
        </form>
    );
}

export default RoomForm;