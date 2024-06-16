import React from "react";
import logo from "../assets/movie-video-camera-3d-vector-icon-cartoon-minimal-style_1033579-37287.png";
import { Link } from "react-router-dom";
const Navbar = () => {
  return (
    <div className="">
      <div className="border flex space-x-6 h-12 items-center pl-3 py-3">
        <img className="mx-10 bg-black w-[50px]" src={logo} alt="" />
        <Link to="/" className="text-blue-800 text-2xl">
          Movies
        </Link>
        <Link to="/WatchList" className="text-blue-800 text-2xl">
          WatchList
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
