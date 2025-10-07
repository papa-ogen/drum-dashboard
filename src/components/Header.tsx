import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation();

  return (
    <header className="mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-white tracking-tight">
            Drum Progress Dashboard
          </h1>
          <p className="text-indigo-400 mt-1">
            Keep the rhythm going. Log your practice sessions below.
          </p>
        </div>
        <nav className="flex gap-2 bg-gray-800 p-1 rounded-lg">
          <Link
            to="/"
            className={`px-4 py-2 rounded-md font-medium transition ${
              location.pathname === "/"
                ? "bg-indigo-600 text-white"
                : "text-gray-300 hover:bg-gray-700"
            }`}
          >
            Dashboard
          </Link>
          <Link
            to="/summary"
            className={`px-4 py-2 rounded-md font-medium transition ${
              location.pathname === "/summary"
                ? "bg-indigo-600 text-white"
                : "text-gray-300 hover:bg-gray-700"
            }`}
          >
            Summary
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
