import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { getUser, logout } from "../utils/auth";

const TopNav: React.FC = () => {
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navigate = useNavigate();
  const user = getUser();

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 py-4 transition-colors ${
      scrolled ? "bg-black/90" : "bg-gradient-to-b from-black/70 to-transparent"
    }`}>
      <NavLink to="/" className="text-red-600 text-3xl font-bold">NETFLIX</NavLink>
      <ul className="hidden md:flex gap-6 text-gray-300 text-sm">
        <li>
          <NavLink to="/" className={({ isActive }: { isActive: boolean }) => `hover:text-white ${isActive ? 'text-white' : ''}`}>Home</NavLink>
        </li>
        <li>
          <NavLink to="/tv" className={({ isActive }: { isActive: boolean }) => `hover:text-white ${isActive ? 'text-white' : ''}`}>TV Shows</NavLink>
        </li>
        <li>
          <NavLink to="/movies" className={({ isActive }: { isActive: boolean }) => `hover:text-white ${isActive ? 'text-white' : ''}`}>Movies</NavLink>
        </li>
        <li>
          <NavLink to="/popular" className={({ isActive }: { isActive: boolean }) => `hover:text-white ${isActive ? 'text-white' : ''}`}>New & Popular</NavLink>
        </li>
        <li>
          <NavLink to="/my-list" className={({ isActive }: { isActive: boolean }) => `hover:text-white ${isActive ? 'text-white' : ''}`}>My List</NavLink>
        </li>
      </ul>
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <NavLink to="/profile" className="text-sm text-gray-300 hover:text-white">
              {user.email}
            </NavLink>
            <button onClick={handleLogout} className="text-sm text-gray-300 hover:text-white">Logout</button>
          </>
        ) : (
          <div className="flex items-center gap-3">
            <NavLink to="/login" className="text-sm text-gray-300 hover:text-white">Login</NavLink>
            <NavLink to="/register" className="text-sm text-white bg-red-600 hover:bg-red-700 rounded px-3 py-1">Sign Up</NavLink>
          </div>
        )}
      </div>
    </nav>
  );
};

export default TopNav;


