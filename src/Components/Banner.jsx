import React from "react";
import bg_logo from "../assets/venom-2018-thumpnail.jpg";
const Banner = () => {
  return (
    <div
      className="md:h-[75vh] bg-center bg-contain bg-none sm:bg-no-repeat bg-black flex items-end justify-center"
      style={{ backgroundImage: `url('${bg_logo}')` }}
    >
      <div className="text-white p-5 text-2xl bg-black w-full text-center bg-opacity-40">
        Venom
      </div>
    </div>
  );
};

export default Banner;
