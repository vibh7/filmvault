import React from "react";

const MovieCard = ({
  movieObj,
  poster_path,
  title,
  watchList,
  handleWatchList,
  handleRemoveWatchList,
}) => {
  const isInWatchList = watchList.some((movie) => movie.id === movieObj.id);

  return (
    <div className="group relative h-[280px] w-[180px] rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 hover:z-20 cursor-pointer flex-shrink-0">
      {/* Poster Image */}
      <img
        src={`https://image.tmdb.org/t/p/original/${poster_path}`}
        alt={title}
        className="w-full h-full object-cover group-hover:brightness-75 transition-all duration-300"
      />

      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300"></div>

      {/* Title at Bottom */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 transform translate-y-full group-hover:translate-y-0 transition-all duration-300">
        <p className="text-white font-semibold text-sm line-clamp-2">{title}</p>
      </div>

      {/* Action Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          if (isInWatchList) {
            handleRemoveWatchList(movieObj);
          } else {
            handleWatchList(movieObj);
          }
        }}
        className={`absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 transform ${
          isInWatchList
            ? "bg-red-600 hover:bg-red-700 text-white scale-100"
            : "bg-blue-600/80 hover:bg-blue-700 text-white scale-90 group-hover:scale-100"
        }`}
      >
        {isInWatchList ? "✓" : "+"}
      </button>

      {/* Rating Badge */}
      <div className="absolute top-3 left-3 bg-yellow-500 text-black px-2 py-1 rounded-lg font-bold text-xs">
        ⭐ {movieObj.vote_average?.toFixed(1) || "N/A"}
      </div>
    </div>
  );
};

export default MovieCard;