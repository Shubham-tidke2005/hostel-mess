import { useEffect, useState } from "react";

const EMPTY_FORM = {
    room: "",
    remarks: "",
};

function BookingForm({
    initialData = null,
    rooms = [],
    onSubmit,
    submitting = false,
    submitLabel = "Request Booking",
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
            room:
                typeof initialData.room === "object"
                    ? initialData.room?.id ?? ""
                    : initialData.room ?? "",
            remarks: initialData.remarks ?? "",
        });

        setErrors({});
    }, [initialData]);

    const getAvailableBeds = (room) => {
        const capacity = Number(room?.capacity || 0);
        const occupied = Number(room?.occupied_beds || 0);

        return Math.max(capacity - occupied, 0);
    };

    const isRoomAvailable = (room) => {
        const availableBeds = getAvailableBeds(room);

        return (
            availableBeds > 0 &&
            room?.status !== "Maintenance" &&
            room?.status !== "Full"
        );
    };

    const availableRooms = rooms.filter(isRoomAvailable);

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

    const validate = () => {
        const newErrors = {};

        if (!formData.room) {
            newErrors.room = "Please select a room.";
        } else {
            const selectedRoom = rooms.find(
                (room) =>
                    String(room.id) === String(formData.room)
            );

            if (!selectedRoom) {
                newErrors.room = "Selected room was not found.";
            } else if (!isRoomAvailable(selectedRoom)) {
                newErrors.room =
                    "This room is no longer available.";
            }
        }

        if (formData.remarks.trim().length > 500) {
            newErrors.remarks =
                "Remarks cannot exceed 500 characters.";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validate()) {
            return;
        }

        const bookingData = {
            room: Number(formData.room),
            remarks: formData.remarks.trim(),
        };

        await onSubmit(bookingData);
    };

    const selectedRoom = rooms.find(
        (room) =>
            String(room.id) === String(formData.room)
    );

    const selectedAvailableBeds = selectedRoom
        ? getAvailableBeds(selectedRoom)
        : 0;

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-6"
        >
            {/* Room */}
            <div>
                <label
                    htmlFor="room"
                    className="mb-2 block text-sm font-medium text-[#1A1A1A]"
                >
                    Select Room
                </label>

                <select
                    id="room"
                    name="room"
                    value={formData.room}
                    onChange={handleChange}
                    disabled={
                        submitting ||
                        availableRooms.length === 0
                    }
                    className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-[#1A1A1A] outline-none transition focus:ring-2 ${
                        errors.room
                            ? "border-red-400 focus:ring-red-100"
                            : "border-slate-200 focus:border-[#2563EB] focus:ring-blue-100"
                    }`}
                >
                    <option value="">
                        {availableRooms.length === 0
                            ? "No rooms available"
                            : "Select a room"}
                    </option>

                    {availableRooms.map((room) => (
                        <option
                            key={room.id}
                            value={room.id}
                        >
                            Room {room.room_number}
                            {" — "}
                            {getAvailableBeds(room)}{" "}
                            bed
                            {getAvailableBeds(room) !== 1
                                ? "s"
                                : ""}{" "}
                            available
                        </option>
                    ))}
                </select>

                {errors.room && (
                    <p className="mt-1.5 text-sm text-red-600">
                        {errors.room}
                    </p>
                )}

                {availableRooms.length === 0 && (
                    <p className="mt-1.5 text-sm text-[#6C757D]">
                        There are currently no available
                        rooms for booking.
                    </p>
                )}
            </div>

            {/* Selected Room Summary */}
            {selectedRoom && (
                <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
                    <p className="text-sm font-semibold text-blue-700">
                        Selected Room
                    </p>

                    <div className="mt-4 grid gap-4 sm:grid-cols-3">
                        <div>
                            <p className="text-xs text-blue-600">
                                Room
                            </p>

                            <p className="mt-1 font-bold text-[#1A1A1A]">
                                {selectedRoom.room_number}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs text-blue-600">
                                Capacity
                            </p>

                            <p className="mt-1 font-bold text-[#1A1A1A]">
                                {selectedRoom.capacity}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs text-blue-600">
                                Available Beds
                            </p>

                            <p className="mt-1 font-bold text-[#2563EB]">
                                {selectedAvailableBeds}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Remarks */}
            <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                    <label
                        htmlFor="remarks"
                        className="block text-sm font-medium text-[#1A1A1A]"
                    >
                        Remarks
                    </label>

                    <span className="text-xs text-[#6C757D]">
                        {formData.remarks.length}/500
                    </span>
                </div>

                <textarea
                    id="remarks"
                    name="remarks"
                    rows={5}
                    maxLength={500}
                    value={formData.remarks}
                    onChange={handleChange}
                    placeholder="Enter any additional information for the administrator..."
                    disabled={submitting}
                    className={`w-full resize-none rounded-xl border bg-white px-4 py-3 text-sm text-[#1A1A1A] outline-none transition placeholder:text-slate-400 focus:ring-2 ${
                        errors.remarks
                            ? "border-red-400 focus:ring-red-100"
                            : "border-slate-200 focus:border-[#2563EB] focus:ring-blue-100"
                    }`}
                />

                {errors.remarks && (
                    <p className="mt-1.5 text-sm text-red-600">
                        {errors.remarks}
                    </p>
                )}
            </div>

            {/* Information */}
            <div className="rounded-2xl border border-slate-200 bg-[#F8F9FA] p-5">
                <p className="text-sm font-semibold text-[#1A1A1A]">
                    Booking Information
                </p>

                <p className="mt-2 text-sm leading-6 text-[#6C757D]">
                    Your booking request will be submitted with
                    <span className="font-semibold text-[#1A1A1A]">
                        {" "}Pending
                    </span>
                    {" "}status. An administrator must approve
                    the request before the room is assigned.
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
                    disabled={
                        submitting ||
                        availableRooms.length === 0
                    }
                    className="rounded-xl bg-[#2563EB] px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {submitting
                        ? "Submitting..."
                        : submitLabel}
                </button>
            </div>
        </form>
    );
}

export default BookingForm;