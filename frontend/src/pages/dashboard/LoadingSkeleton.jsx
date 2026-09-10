
function LoadingSkeleton({ height = "h-[400px]" }) {
    return (
        <div
            className={`w-full ${height} animate-pulse space-y-6`}
        >
            {/* Page Header */}
            <div className="space-y-3">
                <div className="h-10 w-64 rounded-lg bg-slate-200" />
                <div className="h-5 w-96 max-w-full rounded bg-slate-100" />
            </div>

            {/* Search / Filter Skeleton */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="grid gap-4 md:grid-cols-[1fr_220px]">
                    <div className="h-12 rounded-xl bg-slate-100" />
                    <div className="h-12 rounded-xl bg-slate-100" />
                </div>
            </div>

            {/* Cards Skeleton */}
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
            </div>
        </div>
    );
}

function SkeletonCard() {
    return (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            {/* Image */}
            <div className="h-52 bg-slate-200" />

            {/* Content */}
            <div className="space-y-4 p-5">
                <div className="h-6 w-3/4 rounded bg-slate-200" />

                <div className="space-y-2">
                    <div className="h-4 w-full rounded bg-slate-100" />
                    <div className="h-4 w-5/6 rounded bg-slate-100" />
                </div>

                <div className="h-4 w-1/2 rounded bg-slate-100" />

                {/* Buttons */}
                <div className="grid grid-cols-3 gap-2 border-t border-slate-100 pt-4">
                    <div className="h-9 rounded-lg bg-slate-100" />
                    <div className="h-9 rounded-lg bg-slate-100" />
                    <div className="h-9 rounded-lg bg-slate-100" />
                </div>
            </div>
        </div>
    );
}

export default LoadingSkeleton;

