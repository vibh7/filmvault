import React, { useEffect, useState } from "react";
import axios from "axios";

const Banner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [topMovies, setTopMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch top rated movies for banner
  useEffect(() => {
    axios
      .get(
        "https://api.themoviedb.org/3/movie/top_rated?api_key=c59aba7b9da6ec693cc0b19342073983&language=en-US&page=1"
      )
      .then((res) => {
        setTopMovies(res.data.results.slice(0, 5)); // Get top 5 movies
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching banner movies:", err);
        setLoading(false);
      });
  }, []);

  // Auto-rotate banner every 5 seconds
  useEffect(() => {
    if (topMovies.length === 0) return;
    
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % topMovies.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [topMovies]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  if (loading || topMovies.length === 0) {
    return (
      <div className="h-[70vh] bg-gradient-to-b from-gray-800 to-gray-900 flex items-center justify-center">
        <div className="animate-pulse text-white text-2xl">Loading...</div>
      </div>
    );
  }

  const movie = topMovies[currentSlide];

  return (
    <div className="relative h-[70vh] w-full overflow-hidden">
      {/* Banner Image */}
      <div
        className="w-full h-full bg-cover bg-center transition-all duration-1000 ease-in-out"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.8)), url('https://image.tmdb.org/t/p/original/${movie.backdrop_path}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Content Overlay */}
        <div className="absolute inset-0 flex flex-col justify-end p-8">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
              {movie.title}
            </h1>
            <p className="text-gray-200 text-lg mb-6 line-clamp-2 drop-shadow">
              {movie.overview}
            </p>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 bg-blue-600/80 px-4 py-2 rounded-lg">
                <span className="text-yellow-400">⭐</span>
                <span className="text-white font-semibold">{movie.vote_average}/10</span>
              </div>
              <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-all transform hover:scale-105">
                Watch Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3 z-10">
        {topMovies.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 rounded-full ${
              index === currentSlide
                ? "bg-blue-600 w-3 h-3"
                : "bg-gray-400 hover:bg-gray-300 w-2 h-2"
            }`}
          />
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={() => goToSlide((currentSlide - 1 + topMovies.length) % topMovies.length)}
        className="absolute left-6 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all"
      >
        ❮
      </button>
      <button
        onClick={() => goToSlide((currentSlide + 1) % topMovies.length)}
        className="absolute right-6 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all"
      >
        ❯
      </button>
    </div>
  );
};

export default Banner;