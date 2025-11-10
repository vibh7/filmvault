import React, { useEffect, useState } from "react";
import MovieCard from "./MovieCard";
import axios from "axios";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Movies = ({ watchList, handleWatchList, handleRemoveWatchList }) => {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);

  const handlePage = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  useEffect(() => {
    setLoading(true);
    axios
      .get(
        `https://api.themoviedb.org/3/movie/popular?api_key=c59aba7b9da6ec693cc0b19342073983&language=en-US&page=${page}`
      )
      .then((res) => {
        setMovies(res.data.results);
        setTotalPages(res.data.total_pages);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching movies:", err);
        setLoading(false);
      });
  }, [page]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <div className="mb-10">
          <h2 className="text-4xl font-bold text-white mb-2">🎬 Trending Movies</h2>
          <p className="text-gray-400">Discover the most popular movies right now</p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center h-96">
            <div className="animate-spin">
              <div className="w-16 h-16 border-4 border-blue-500 border-t-purple-500 rounded-full"></div>
            </div>
          </div>
        )}

        {/* Movies Grid */}
        {!loading && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-12">
              {movies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movieObj={movie}
                  poster_path={movie.poster_path}
                  title={movie.title}
                  watchList={watchList}
                  handleWatchList={handleWatchList}
                  handleRemoveWatchList={handleRemoveWatchList}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-center items-center gap-4 mt-12">
              <button
                onClick={() => handlePage(page - 1)}
                disabled={page === 1}
                className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-semibold transition-all"
              >
                <ChevronLeft size={20} /> Previous
              </button>

              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={page}
                  onChange={(e) => {
                    const newPage = parseInt(e.target.value);
                    if (newPage >= 1 && newPage <= totalPages) {
                      handlePage(newPage);
                    }
                  }}
                  className="w-16 px-2 py-2 text-center bg-gray-800 text-white border border-gray-600 rounded-lg"
                />
                <span className="text-gray-400 font-semibold">/ {totalPages}</span>
              </div>

              <button
                onClick={() => handlePage(page + 1)}
                disabled={page === totalPages}
                className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-semibold transition-all"
              >
                Next <ChevronRight size={20} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Movies;