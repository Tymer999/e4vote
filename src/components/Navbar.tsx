import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { FaBars } from "react-icons/fa";

const Navbar = () => {
  const { loggedIn, userDetails } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="px-[.5rem]">
      <nav className="items-center flex justify-between border border-gray-700 bg-gray-700/50 w-full rounded-full max-w-[1247px] mx-auto h-[4rem] px-[1.55rem] md:px-[2.55rem] backdrop-blur-3xl relative">


      <NavLink to="/" className="flex items-center gap-2 flex-1">
        <h2 className="font-bold text-lg text-blue-500">Evote-Group4</h2>
      </NavLink>

        {/* Hamburger for mobile */}
        <button
          className="md:hidden flex items-center px-3 py-2 text-white"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <FaBars className="text-2xl" />
        </button>

        {/* Desktop menu */}
        <ul className="hidden md:flex items-center gap-4 text-gray-200 flex-1">
          <li className="hover:text-blue-600">
            <NavLink to={"/"}>Home</NavLink>
          </li>
          <li className="hover:text-blue-600">
            <NavLink to={"/about"}>About</NavLink>
          </li>
          <li className="hover:text-blue-600">
            <NavLink to={"/services"}>Services</NavLink>
          </li>
          <li className="hover:text-blue-600">
            <NavLink to={"/help"}>Help</NavLink>
          </li>
          {/* <li className="hover:text-blue-600">
            <NavLink to={"/pricing"}>Pricing</NavLink>
          </li> */}
        </ul>

        <div className="hidden md:flex flex-1 justify-end">
          {loggedIn ? (
            <div className="flex items-center gap-4">
                <h4 className="text-white">Welcome, {userDetails?.name}!</h4>
            <NavLink
              to="/admin"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-semibold transition"
            >
              Dashboard
            </NavLink>
            </div>
          ) : (
            <NavLink
              to="/login"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-semibold transition"
            >
              Login
            </NavLink>
          )}
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="absolute top-[4.5rem] left-0 w-full bg-black/90 text-white rounded-3xl shadow-lg z-500 md:hidden">
            <ul className="flex flex-col items-center gap-4 py-8">
              <li>
                <NavLink to={"/"} onClick={() => setMenuOpen(false)}>
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink to={"/about"} onClick={() => setMenuOpen(false)}>
                  About
                </NavLink>
              </li>
              <li>
                <NavLink to={"/services"} onClick={() => setMenuOpen(false)}>
                  Services
                </NavLink>
              </li>
              <li>
                <NavLink to={"/help"} onClick={() => setMenuOpen(false)}>
                  Help
                </NavLink>
              </li>
              <li>
                <NavLink to={"/pricing"} onClick={() => setMenuOpen(false)}>
                  Pricing
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-semibold transition w-full text-center"
                >
                  Login
                </NavLink>
              </li>
            </ul>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Navbar;
