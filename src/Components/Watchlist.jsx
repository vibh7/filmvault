import React, { useEffect, useState } from "react";
import { Delete, Download, Share2, Star, TrendingUp, Lightbulb, Loader } from "lucide-react";
import axios from "axios";
import genres from "../Utility/genre";

const Watchlist = ({ watchList, handleRemoveWatchList, setWatchList }) => {
  const [search, setSearch] = useState("");
  const [genreList, setGenreList] = useState(["All Genres"]);
  const [currGenre, setCurrGenre] = useState("All Genres");
  const [sortOrder, setSortOrder] = useState("none");
  const [viewMode, setViewMode] = useState("table");
  const [recommendations, setRecommendations] = useState([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);

  // Fetch recommendations based on watchlist
  const fetchRecommendations = async () => {
    if (watchList.length === 0) return;

    setLoadingRecommendations(true);
    try {
      // Get recommendations based on top 3 movies in watchlist
      const topMovies = watchList
        .sort((a, b) => b.vote_average - a.vote_average)
        .slice(0, 3);

      const recommendedMovies = new Map();

      for (const movie of topMovies) {
        try {
          const response = await axios.get(
            `https://api.themoviedb.org/3/movie/${movie.id}/recommendations?api_key=c59aba7b9da6ec693cc0b19342073983&language=en-US&page=1`
          );

          response.data.results.slice(0, 4).forEach((rec) => {
            if (!watchList.some((m) => m.id === rec.id) && rec.poster_path) {
              recommendedMovies.set(rec.id, rec);
            }
          });
        } catch (error) {
          console.error("Error fetching recommendations:", error);
        }
      }

      // Convert to array and sort by rating
      const recArray = Array.from(recommendedMovies.values())
        .sort((a, b) => b.vote_average - a.vote_average)
        .slice(0, 8);

      setRecommendations(recArray);
    } catch (error) {
      console.error("Error in recommendation process:", error);
    } finally {
      setLoadingRecommendations(false);
    }
  };

  // Fetch recommendations when watchlist changes
  useEffect(() => {
    if (watchList.length > 0) {
      fetchRecommendations();
    }
  }, [watchList.length]);

  // Sort functions
  const handleSort = (order) => {
    let sorted = [...watchList];

    if (order === "asc") {
      sorted.sort((a, b) => a.vote_average - b.vote_average);
    } else if (order === "desc") {
      sorted.sort((a, b) => b.vote_average - a.vote_average);
    } else if (order === "popularity") {
      sorted.sort((a, b) => b.popularity - a.popularity);
    }

    setWatchList(sorted);
    setSortOrder(order);
  };

  // Genre filtering
  const handleGenreChange = (genre) => {
    setCurrGenre(genre);
  };

  // Extract unique genres
  useEffect(() => {
    const uniqueGenres = new Set(
      watchList
        .filter((movie) => movie.genre_ids && movie.genre_ids[0])
        .map((movie) => genres[movie.genre_ids[0]])
        .filter(Boolean)
    );
    setGenreList(["All Genres", ...Array.from(uniqueGenres)]);
  }, [watchList]);

  // Filter movies
  const filteredMovies = watchList
    .filter((movie) => {
      if (currGenre === "All Genres") return true;
      return genres[movie.genre_ids?.[0]] === currGenre;
    })
    .filter((movie) =>
      movie.title.toLowerCase().includes(search.toLowerCase())
    );

  // Calculate stats
  const totalRating = filteredMovies.reduce((sum, movie) => sum + (movie.vote_average || 0), 0);
  const avgRating = filteredMovies.length > 0 ? (totalRating / filteredMovies.length).toFixed(2) : 0;
  const totalPopularity = filteredMovies.reduce((sum, m) => sum + (m.popularity || 0), 0).toFixed(0);
  const topRated = filteredMovies.length > 0
    ? filteredMovies.reduce((max, m) => m.vote_average > max.vote_average ? m : max)
    : null;

  // Export as JSON
  const handleExport = () => {
    const dataStr = JSON.stringify(filteredMovies, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "my-watchlist.json";
    link.click();
  };

  // Share watchlist
  const handleShare = () => {
    const message = `📽️ Check out my watchlist! I have ${watchList.length} movies saved with an average rating of ${avgRating}/10`;
    navigator.clipboard.writeText(message);
    alert("Watchlist summary copied to clipboard!");
  };

  // Add recommended movie to watchlist
  const addRecommendedToWatchlist = (movie) => {
    if (!watchList.some((m) => m.id === movie.id)) {
      setWatchList([...watchList, movie]);
      alert(`✅ "${movie.title}" added to watchlist!`);
    } else {
      alert("This movie is already in your watchlist!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-950 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header with Stats */}
        <div className="mb-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-5xl font-bold text-white mb-2">❤️ My Watchlist</h1>
              <p className="text-gray-400 text-lg">
                {watchList.length} movies • {filteredMovies.length} in filters
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleExport}
                className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-4 py-3 rounded-lg font-semibold transition-all transform hover:scale-105"
              >
                <Download size={20} /> Export
              </button>
              <button
                onClick={handleShare}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-4 py-3 rounded-lg font-semibold transition-all transform hover:scale-105"
              >
                <Share2 size={20} /> Share
              </button>
            </div>
          </div>
        </div>

        {watchList.length === 0 ? (
          <div className="text-center py-32">
            <div className="text-8xl mb-6 animate-bounce">🍿</div>
            <h2 className="text-3xl font-bold text-white mb-3">Your watchlist is empty</h2>
            <p className="text-gray-400 text-lg max-w-md mx-auto">
              Start building your collection! Head to the trending section and add your favorite movies.
            </p>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="relative overflow-hidden bg-gradient-to-br from-blue-600/20 to-blue-600/5 border border-blue-500/30 rounded-xl p-6 hover:border-blue-500/60 transition-all group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent group-hover:from-blue-500/10 transition-all"></div>
                <div className="relative">
                  <p className="text-gray-400 text-sm font-medium mb-2">📊 Total Movies</p>
                  <p className="text-4xl font-bold text-blue-400">{filteredMovies.length}</p>
                  <p className="text-xs text-gray-500 mt-2">out of {watchList.length} total</p>
                </div>
              </div>

              <div className="relative overflow-hidden bg-gradient-to-br from-purple-600/20 to-purple-600/5 border border-purple-500/30 rounded-xl p-6 hover:border-purple-500/60 transition-all group">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-transparent group-hover:from-purple-500/10 transition-all"></div>
                <div className="relative">
                  <p className="text-gray-400 text-sm font-medium mb-2">⭐ Avg Rating</p>
                  <p className="text-4xl font-bold text-purple-400">{avgRating}</p>
                  <p className="text-xs text-gray-500 mt-2">out of 10.0</p>
                </div>
              </div>

              <div className="relative overflow-hidden bg-gradient-to-br from-green-600/20 to-green-600/5 border border-green-500/30 rounded-xl p-6 hover:border-green-500/60 transition-all group">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-transparent group-hover:from-green-500/10 transition-all"></div>
                <div className="relative">
                  <p className="text-gray-400 text-sm font-medium mb-2">📈 Total Popularity</p>
                  <p className="text-4xl font-bold text-green-400">{totalPopularity}</p>
                  <p className="text-xs text-gray-500 mt-2">combined score</p>
                </div>
              </div>

              <div className="relative overflow-hidden bg-gradient-to-br from-yellow-600/20 to-yellow-600/5 border border-yellow-500/30 rounded-xl p-6 hover:border-yellow-500/60 transition-all group">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/5 to-transparent group-hover:from-yellow-500/10 transition-all"></div>
                <div className="relative">
                  <p className="text-gray-400 text-sm font-medium mb-2">🏆 Top Rated</p>
                  <p className="text-2xl font-bold text-yellow-400 truncate">
                    {topRated?.title?.substring(0, 14) || "N/A"}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">⭐ {topRated?.vote_average}</p>
                </div>
              </div>
            </div>

            {/* Filter Section */}
            <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 mb-8 hover:border-gray-600/50 transition-all">
              <div className="mb-6">
                <label className="text-white font-bold mb-3 block text-lg">🎭 Filter by Genre</label>
                <div className="flex flex-wrap gap-3">
                  {genreList.map((genre) => (
                    <button
                      key={genre}
                      onClick={() => handleGenreChange(genre)}
                      className={`px-4 py-2 rounded-full font-semibold transition-all transform hover:scale-105 ${
                        currGenre === genre
                          ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/50"
                          : "bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600"
                      }`}
                    >
                      {genre}
                    </button>
                  ))}
                </div>
              </div>

              <input
                type="text"
                placeholder="🔍 Search movies by title..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
            </div>

            {/* View Mode & Sort Controls */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div className="flex gap-2 bg-gray-800/50 p-2 rounded-lg border border-gray-700/50">
                <button
                  onClick={() => setViewMode("table")}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    viewMode === "table"
                      ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg"
                      : "text-gray-400 hover:text-gray-300"
                  }`}
                >
                  📋 Table View
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    viewMode === "grid"
                      ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg"
                      : "text-gray-400 hover:text-gray-300"
                  }`}
                >
                  🎴 Grid View
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleSort("desc")}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    sortOrder === "desc"
                      ? "bg-gradient-to-r from-red-600 to-pink-600 text-white"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  ⬇️ Rating (High)
                </button>
                <button
                  onClick={() => handleSort("asc")}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    sortOrder === "asc"
                      ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  ⬆️ Rating (Low)
                </button>
                <button
                  onClick={() => handleSort("popularity")}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    sortOrder === "popularity"
                      ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  📈 Popularity
                </button>
                <button
                  onClick={() => handleSort("none")}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    sortOrder === "none"
                      ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  🔄 Reset
                </button>
              </div>
            </div>

            {/* Grid View */}
            {viewMode === "grid" && filteredMovies.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-12">
                {filteredMovies.map((movie) => (
                  <div
                    key={movie.id}
                    className="group relative rounded-lg overflow-hidden shadow-xl hover:shadow-2xl transition-all hover:scale-110 h-80 bg-gray-700/20 border border-gray-700/30 hover:border-blue-500/50"
                  >
                    <img
                      src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`}
                      alt={movie.title}
                      className="w-full h-full object-cover group-hover:brightness-50 transition-all"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all"></div>

                    <div className="absolute inset-0 flex flex-col justify-between p-4 opacity-0 group-hover:opacity-100 transition-all">
                      <div>
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                          movie.vote_average >= 7
                            ? "bg-green-500 text-white"
                            : movie.vote_average >= 5
                            ? "bg-yellow-500 text-black"
                            : "bg-red-500 text-white"
                        }`}>
                          ⭐ {movie.vote_average.toFixed(1)}
                        </span>
                      </div>
                      <div className="space-y-2">
                        <p className="text-white font-bold text-sm line-clamp-2">{movie.title}</p>
                        <button
                          onClick={() => handleRemoveWatchList(movie)}
                          className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white px-3 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all transform hover:scale-105"
                        >
                          <Delete size={16} /> Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Table View */}
            {viewMode === "table" && filteredMovies.length > 0 && (
              <div className="overflow-x-auto rounded-xl border border-gray-700/50 shadow-2xl bg-gray-900/30 backdrop-blur mb-12">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-700">
                      <th className="px-6 py-4 text-left text-gray-300 font-bold">Movie</th>
                      <th className="px-6 py-4 text-center text-gray-300 font-bold">Rating</th>
                      <th className="px-6 py-4 text-center text-gray-300 font-bold">Popularity</th>
                      <th className="px-6 py-4 text-center text-gray-300 font-bold">Genre</th>
                      <th className="px-6 py-4 text-center text-gray-300 font-bold">Year</th>
                      <th className="px-6 py-4 text-center text-gray-300 font-bold">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMovies.map((movie, index) => (
                      <tr
                        key={movie.id}
                        className={`border-b border-gray-700/30 hover:bg-gray-800/40 transition-all ${
                          index % 2 === 0 ? "bg-gray-900/20" : "bg-gray-900/10"
                        }`}
                      >
                        <td className="px-6 py-4 flex items-center gap-4">
                          <img
                            src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`}
                            alt={movie.title}
                            className="h-20 w-14 rounded-lg object-cover shadow-lg border border-gray-600/30"
                          />
                          <div className="flex-1">
                            <p className="text-white font-bold text-sm hover:text-blue-400 cursor-pointer transition-all line-clamp-1">
                              {movie.title}
                            </p>
                            <p className="text-gray-400 text-xs mt-1 line-clamp-2">
                              {movie.overview}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className={`px-3 py-1 rounded-full font-bold text-sm inline-block ${
                            movie.vote_average >= 7
                              ? "bg-green-500/20 text-green-400"
                              : movie.vote_average >= 5
                              ? "bg-yellow-500/20 text-yellow-400"
                              : "bg-red-500/20 text-red-400"
                          }`}>
                            ⭐ {movie.vote_average.toFixed(1)}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="text-gray-300 font-semibold bg-gray-800/50 px-3 py-1 rounded">
                            {movie.popularity.toFixed(0)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="bg-purple-600/20 text-purple-400 px-3 py-1 rounded-full text-sm font-semibold">
                            {genres[movie.genre_ids?.[0]] || "—"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="text-gray-400 font-semibold">{movie.release_date?.split("-")[0] || "—"}</span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => handleRemoveWatchList(movie)}
                            className="bg-gradient-to-r from-red-600/20 to-pink-600/20 hover:from-red-600/40 hover:to-pink-600/40 text-red-400 hover:text-red-300 px-3 py-2 rounded-lg font-semibold flex items-center gap-2 mx-auto transition-all border border-red-500/30 hover:border-red-500/60"
                          >
                            <Delete size={16} /> Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* No Results State */}
            {filteredMovies.length === 0 && (
              <div className="text-center py-16 bg-gradient-to-br from-gray-800/30 to-gray-700/30 rounded-xl border border-gray-700/50 mb-12">
                <p className="text-gray-300 text-2xl font-bold mb-2">🔍 No movies found</p>
                <p className="text-gray-500 mb-4">Try adjusting your search or filter criteria</p>
                <button
                  onClick={() => {
                    setSearch("");
                    setCurrGenre("All Genres");
                  }}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-all"
                >
                  Clear Filters
                </button>
              </div>
            )}

            {/* Recommendations Section */}
            {recommendations.length > 0 && (
              <div className="mt-12">
                <div className="flex items-center gap-3 mb-6">
                  <Lightbulb className="text-yellow-400" size={28} />
                  <h2 className="text-3xl font-bold text-white">✨ Recommended For You</h2>
                  <span className="text-gray-400 text-sm">(Based on your watchlist)</span>
                </div>

                {loadingRecommendations ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin">
                      <Loader className="text-blue-500" size={40} />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {recommendations.map((movie) => (
                      <div
                        key={movie.id}
                        className="group relative rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all hover:scale-105 h-72 bg-gray-700/20 border border-gray-700/30 hover:border-yellow-500/50"
                      >
                        <img
                          src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`}
                          alt={movie.title}
                          className="w-full h-full object-cover group-hover:brightness-50 transition-all"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition-all"></div>

                        <div className="absolute inset-0 flex flex-col justify-between p-3 opacity-0 group-hover:opacity-100 transition-all">
                          <span className="bg-yellow-500 text-black px-2 py-1 rounded text-xs font-bold w-fit">
                            ⭐ {movie.vote_average.toFixed(1)}
                          </span>
                          <div className="space-y-2">
                            <p className="text-white font-bold text-xs line-clamp-2">{movie.title}</p>
                            <button
                              onClick={() => addRecommendedToWatchlist(movie)}
                              className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-2 py-2 rounded-lg font-semibold text-xs flex items-center justify-center gap-1 transition-all transform hover:scale-105"
                            >
                              <Star size={14} /> Add
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <p className="text-gray-400 text-sm mt-6 text-center">
                  💡 Recommendations are based on the highest-rated movies in your watchlist
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Watchlist;