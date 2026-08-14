import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [menuOpen, setMenuOpen] =
    useState(false);

  const dashboardPath =
    user?.role === "ngo"
      ? "/ngo-dashboard"
      : "/dashboard";

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate("/login");
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex min-h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6 md:px-8 lg:px-10">

        {/* LOGO */}

        <Link
          to="/"
          onClick={closeMenu}
          className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl"
        >
          HelpGrid
        </Link>

        {/* DESKTOP NAV */}

        <div className="hidden items-center gap-6 md:flex">

          <Link
            to="/"
            className="text-sm font-medium text-gray-700 transition hover:text-black"
          >
            Home
          </Link>

          {user ? (
            <>
              <Link
                to={dashboardPath}
                className="text-sm font-medium text-gray-700 transition hover:text-black"
              >
                Dashboard
              </Link>

              <span className="max-w-[150px] truncate text-sm font-medium text-gray-600">
                {user.name}
              </span>

              <button
                onClick={handleLogout}
                className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-black hover:bg-gray-100"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-medium text-gray-700 transition hover:text-black"
              >
                Login
              </Link>

              <Link
                to="/signup"
                className="rounded-xl bg-black px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
              >
                Join HelpGrid
              </Link>
            </>
          )}

        </div>

        {/* MOBILE MENU BUTTON */}

        <button
          type="button"
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
          onClick={() =>
            setMenuOpen(
              (previous) => !previous
            )
          }
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-xl text-gray-900 transition hover:border-black md:hidden"
        >
          {menuOpen ? "✕" : "☰"}
        </button>

      </div>

      {/* MOBILE MENU */}

      {menuOpen && (
        <div className="border-t border-gray-200 bg-white px-4 py-4 shadow-sm md:hidden">

          <div className="mx-auto flex max-w-7xl flex-col gap-2">

            <Link
              to="/"
              onClick={closeMenu}
              className="rounded-xl px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-100 hover:text-black"
            >
              Home
            </Link>

            {user ? (
              <>
                <Link
                  to={dashboardPath}
                  onClick={closeMenu}
                  className="rounded-xl px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-100 hover:text-black"
                >
                  Dashboard
                </Link>

                <div className="rounded-xl bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-700">
                  {user.name}
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-xl border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700 transition hover:border-black hover:bg-gray-100"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="rounded-xl px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-100 hover:text-black"
                >
                  Login
                </Link>

                <Link
                  to="/signup"
                  onClick={closeMenu}
                  className="rounded-xl bg-black px-4 py-3 text-center text-sm font-medium text-white hover:bg-gray-800"
                >
                  Join HelpGrid
                </Link>
              </>
            )}

          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;