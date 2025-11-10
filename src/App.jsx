import { useEffect, useState } from "react";
import "./App.css";
import Navbar from "./Components/Navbar";
import Movies from "./Components/Movies";
import Watchlist from "./Components/Watchlist";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Banner from "./Components/Banner";

function App() {
  const [watchList, setWatchList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add to watchlist with duplicate check
  const handleWatchList = (movieObj) => {
    // Check if movie already exists
    if (watchList.some(movie => movie.id === movieObj.id)) {
      alert("Movie already in watchlist!");
      return;
    }
    
    const newWatchList = [...watchList, movieObj];
    localStorage.setItem("filmvault_watchlist", JSON.stringify(newWatchList));
    setWatchList(newWatchList);
  };

  // Remove from watchlist
  const handleRemoveWatchList = (movieObj) => {
    const filterWatchList = watchList.filter((movie) => movie.id !== movieObj.id);
    localStorage.setItem("filmvault_watchlist", JSON.stringify(filterWatchList));
    setWatchList(filterWatchList);
  };

  // Load watchlist from localStorage on mount
  useEffect(() => {
    try {
      const movieFromLocal = localStorage.getItem("filmvault_watchlist");
      if (movieFromLocal) {
        setWatchList(JSON.parse(movieFromLocal));
      }
    } catch (error) {
      console.error("Error loading watchlist:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="animate-spin">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-purple-500 rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-gray-900 via-gray-800 to-black min-h-screen">
      <BrowserRouter>
        <Navbar watchListCount={watchList.length} />
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Banner />
                <Movies
                  watchList={watchList}
                  handleWatchList={handleWatchList}
                  handleRemoveWatchList={handleRemoveWatchList}
                />
              </>
            }
          />
          <Route
            path="/watchlist"
            element={
              <Watchlist
                watchList={watchList}
                handleRemoveWatchList={handleRemoveWatchList}
                setWatchList={setWatchList}
              />
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;