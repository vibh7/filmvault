import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Navbar = ({ watchListCount = 0 }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-gray-900/95 to-gray-800/95 backdrop-blur-md border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center font-bold text-white">
              📽️
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent group-hover:from-purple-300 group-hover:to-blue-300 transition-all">
              FilmWault
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className="text-gray-300 hover:text-white font-medium transition-colors relative group"
            >
              🎬 Trending
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link
              to="/watchlist"
              className="relative text-gray-300 hover:text-white font-medium transition-colors group"
            >
              <span className="flex items-center gap-2">
                ❤️ Watchlist
                {watchListCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {watchListCount}
                  </span>
                )}
              </span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-white hover:text-purple-400 transition-colors"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {menuOpen && (
          <div className="md:hidden pb-4 border-t border-gray-700 pt-4 space-y-3">
            <Link
              to="/"
              onClick={() => setMenuOpen(false)}
              className="block text-gray-300 hover:text-white hover:bg-gray-700 px-3 py-2 rounded-lg transition-all"
            >
              🎬 Trending
            </Link>
            <Link
              to="/watchlist"
              onClick={() => setMenuOpen(false)}
              className="block text-gray-300 hover:text-white hover:bg-gray-700 px-3 py-2 rounded-lg transition-all relative"
            >
              <span className="flex items-center gap-2">
                ❤️ Watchlist
                {watchListCount > 0 && (
                  <span className="bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {watchListCount}
                  </span>
                )}
              </span>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;