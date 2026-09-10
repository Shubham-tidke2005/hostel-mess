
import { AlertCircle, RefreshCw } from "lucide-react";

function ErrorState({
    message = "Something went wrong.",
    onRetry,
}) {
    return (
        <div className="flex min-h-[400px] items-center justify-center">
            <div className="w-full max-w-md rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
                    <AlertCircle className="h-7 w-7 text-red-500" />
                </div>

                <h2 className="mt-5 text-xl font-semibold text-[#1A1A1A]">
                    Unable to load data
                </h2>

                <p className="mt-2 text-sm leading-6 text-[#6C757D]">
                    {message}
                </p>

                {onRetry && (
                    <button
                        type="button"
                        onClick={onRetry}
                        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#2563EB] px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                    >
                        <RefreshCw className="h-4 w-4" />
                        Try Again
                    </button>
                )}
            </div>
        </div>
    );
}

export default ErrorState;

