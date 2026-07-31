import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8F9FA]">
      <h1 className="text-6xl font-bold text-[#1A1A1A]">404</h1>

      <p className="mt-4 text-[#6C757D]">
        Page Not Found
      </p>

      <Link
        to="/"
        className="mt-6 rounded-xl bg-[#2563EB] px-6 py-3 text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/25"
      >
        Go to Login
      </Link>
    </div>
  );
}

export default NotFound;