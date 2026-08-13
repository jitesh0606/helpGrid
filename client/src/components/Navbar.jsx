import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const navigate = useNavigate();

  const { user, logout } = useAuth();

  const dashboardPath =
    user?.role === "ngo"
      ? "/ngo-dashboard"
      : "/dashboard";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        <Link
          to="/"
          className="text-2xl font-bold text-gray-900"
        >
          HelpGrid
        </Link>

        <div className="flex items-center gap-8">

          <Link
            to="/"
            className="text-sm font-medium text-gray-700 hover:text-black"
          >
            Home
          </Link>

          {user ? (
            <>
              <Link
                to={dashboardPath}
                className="text-sm font-medium text-gray-700 hover:text-black"
              >
                Dashboard
              </Link>

              <span className="text-sm font-medium text-gray-600">
                {user.name}
              </span>

              <button
                onClick={handleLogout}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-medium text-gray-700 hover:text-black"
              >
                Login
              </Link>

              <Link
                to="/signup"
                className="rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
              >
                Join HelpGrid
              </Link>
            </>
          )}

        </div>
      </div>
    </nav>
  );
}

export default Navbar;