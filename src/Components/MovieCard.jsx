import React, { useState } from "react";

const MovieCard = ({
  movieObj,
  poster_path,
  title,
  watchList,
  handleWatchList,
  handleRemoveWatchList,
}) => {
  const doesContain = (movieObj) => {
    for (let i = 0; i < watchList.length; i++) {
      if (watchList[i].id == movieObj.id) {
        return true;
      }
    }
    return false;
  };

  return (
    <div
      className="w-[200px] h-[40vh] bg-cover bg-center rounded-3xl shadow-xl flex flex-col items-end justify-between hover:scale-110 duration-300 hover:cursor-pointer transition-all m-2"
      style={{
        backgroundImage: `url(

      https://image.tmdb.org/t/p/original/${poster_path})`,
      }}
    >
      {doesContain(movieObj) ? (
        <div
          className="m-4 flex justify-center h-8 w-8 rounded-lg bg-gray-900/50 items-center"
          onClick={() => handleRemoveWatchList(movieObj)}
        >
          &#10060;
        </div>
      ) : (
        <div
          className="m-4 flex justify-center h-8 w-8 rounded-lg bg-gray-900/50 items-center"
          onClick={() => handleWatchList(movieObj)}
        >
          &#128525;
        </div>
      )}

      <div className="text-center text-white bg-black w-full bg-opacity-70">
        {title}
      </div>
    </div>
  );
};

export default MovieCard;
