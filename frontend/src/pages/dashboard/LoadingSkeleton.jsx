function LoadingSkeleton({
    height = "h-40",
}) {
    return (
        <div
            className={`
                ${height}
                w-full
                animate-pulse
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-6
                shadow-sm
            `}
        >
            <div className="mb-6 h-6 w-40 rounded bg-gray-200" />

            <div className="space-y-4">

                <div className="h-4 rounded bg-gray-200" />

                <div className="h-4 w-5/6 rounded bg-gray-200" />

                <div className="h-4 w-3/4 rounded bg-gray-200" />

            </div>

        </div>
    );
}

export default LoadingSkeleton;