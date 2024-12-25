import { FaSearch } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";


export default function Header() {
  const currentUser = useSelector((state) => state.user.currentUser);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search)
    urlParams.set('searchTerm', searchTerm)
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`)
  }

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl)
    }
  }, [location.search]);

  // Determine the active page based on the current path
  const activePage = (() => {
    switch (location.pathname) {
      case "/":
        return "home";
      case "/search":
        return "properties";
      case "/about":
        return "about";
      case "/profile":
        return "profile";
      default:
        return "";
    }
  })();

  return (
    <header className="bg-[#161D2D]">
    <div className="flex justify-between items-center max-w-6xl m-auto p-3">
      {/* Logo */}
      <Link to="/">
        <img
          src="/path-to-logo.png"
          alt="Logo"
          className="h-10 w-10 object-cover"
        />
      </Link>
  
      {/* Title */}
      <Link to="/">
        <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
          <span className="text-[#C1AD8C]">Property</span>
          <span className="text-[#C1AD8C]">Finder</span>
        </h1>
      </Link>
  
      {/* Search Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-slate-100 p-3 rounded-lg items-center flex"
      >
        <input
          type="text"
          placeholder="Search..."
          className="bg-transparent focus:outline-none w-24 sm:w-64"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button>
          <FaSearch className="text-slate-600" />
        </button>
      </form>
  
      {/* Navigation Links */}
      <ul className="flex gap-4">
        <Link to="/">
          <li
            className={`hidden sm:inline text-white hover:text-cream-200 transition-colors duration-200 ${
              activePage === "home" ? "text-[#C1AD8C] underline" : ""
            }`}
          >
            HOME
          </li>
        </Link>
        <Link to="/search">
          <li
            className={`hidden sm:inline text-white hover:text-cream-200 transition-colors duration-200 ${
              activePage === "properties" ? "text-[#C1AD8C] underline" : ""
            }`}
          >
            PROPERTIES
          </li>
        </Link>
        <Link to="/about">
          <li
            className={`hidden sm:inline text-white hover:text-cream-200 transition-colors duration-200 ${
              activePage === "about" ? "text-[#C1AD8C] underline" : ""
            }`}
          >
            ABOUT
          </li>
        </Link>
        <Link to="/profile">
          {currentUser ? (
            <img
              src={currentUser.avatar || "default-avatar.png"}
              className="h-7 w-7 rounded-full object-cover"
            />
          ) : (
            <li
              className="sm:inline text-white hover:text-cream-200 transition-colors duration-200"
            >
              SIGN IN
            </li>
          )}
        </Link>
      </ul>
    </div>
  </header>
  
  
  );
}
