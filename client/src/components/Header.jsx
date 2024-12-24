import { FaSearch } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";


export default function Header() {
  const currentUser = useSelector((state) => state.user.currentUser);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate()
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
  }, [location.search])

  return (
    <header className="bg-blue-950 md">
      <div className="flex justify-between items-center max-w-6xl m-auto p-3">
        <Link to={"/"}>
          <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
            <span className="text-white">Property</span>
            <span className="text-white">Finder</span>
          </h1>
        </Link>

        <form onSubmit={handleSubmit} className="bg-slate-100 p-3 rounded-lg items-center flex">
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent focus:outline-none w-24 sm:w-64 "
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button>
            <FaSearch className="text-slate-600" />
          </button>
        </form>
        <ul className="flex gap-4">
          <Link to={"/"}>
            <li className="hidden sm:inline text-white hover:underline">
              HOME
            </li>
          </Link>
          <Link to={"/"}>
            <li className="hidden sm:inline text-white hover:underline">
              PROPERTIES
            </li>
          </Link>
          <Link to={"/about"}>
            <li className="hidden sm:inline text-white hover:underline">
              ABOUT
            </li>
          </Link>
          <Link to={"/profile"}>
            {currentUser ? (
              <img
                src={currentUser.avatar || "default-avatar.png"}
                className="h-7 w-7 rounded-full object-cover"
              />
            ) : (
              <li className="sm:inline text-white hover:underline">
                SIGN IN
              </li>
            )}
          </Link>
        </ul>
      </div>
    </header>
  );
}
