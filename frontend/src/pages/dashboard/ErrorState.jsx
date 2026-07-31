import { TriangleAlert } from "lucide-react";

function ErrorState({
    message = "Something went wrong.",
    onRetry,
}) {
    return (
        <div
            className="
                flex
                flex-col
                items-center
                justify-center
                rounded-2xl
                border
                border-red-200
                bg-red-50
                p-10
                text-center
            "
        >
            <TriangleAlert
                size={60}
                className="mb-4 text-red-500"
            />

            <h2 className="text-xl font-semibold text-red-600">
                Oops!
            </h2>

            <p className="mt-2 text-[#6C757D]">
                {message}
            </p>

            <button
                onClick={onRetry}
                className="
                    mt-6
                    rounded-xl
                    bg-[#2563EB]
                    px-6
                    py-3
                    text-white
                    transition-all
                    duration-300
                    hover:bg-blue-700
                "
            >
                Retry
            </button>

        </div>
    );
}

export default ErrorState;