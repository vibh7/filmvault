import { useEffect, useState } from "react";
import "./App.css";
import Navbar from "./Components/Navbar";
import Movies from "./Components/Movies";
import Watchlist from "./Components/Watchlist";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Banner from "./Components/Banner";
import Paging from "./Components/Paging";
import Child from "./prop_drilling/Child";
import Family from "./prop_drilling/Family";

function App() {
  const [watchList, setWatchList] = useState([]);

  const handleWatchList = (movieObj) => {
    let newWatchList = [...watchList, movieObj];
    localStorage.setItem("movieApp", JSON.stringify(newWatchList));
    setWatchList(newWatchList);
    console.log(newWatchList);
  };

  const handleRemoveWatchList = (movieObj) => {
    let filterWatchList = watchList.filter((movie) => {
      return movie.id != movieObj.id;
    });
    localStorage.setItem("movieApp", JSON.stringify(filterWatchList));
    setWatchList(filterWatchList);
  };

  useEffect(() => {
    let movieFromLocol = localStorage.getItem("movieApp");
    if (!movieFromLocol) {
      return;
    }
    setWatchList(JSON.parse(movieFromLocol));
  }, []);

  return (
    <>
      <BrowserRouter>
        <Navbar />
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
            path="/WatchList"
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
    </>
  );
}

export default App;
