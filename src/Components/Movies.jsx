import React, { useEffect, useState } from "react";
import MovieCard from "./MovieCard";
import axios from "axios";
import Paging from "./Paging";

const Movies = ({watchList, handleWatchList, handleRemoveWatchList}) => {
  const [Movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);

  const handlePage = (page) => {
    setPage(page);
  };

  useEffect(() => {
    axios
      .get(
        `https://api.themoviedb.org/3/movie/popular?api_key=c59aba7b9da6ec693cc0b19342073983&language=en-US&page=${page}`
      )
      .then((res) => {
        setMovies(res.data.results);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [page]);

  return (
    <div className="m-3">
      <div className="text-center font-bold text-2xl">Trending Movies</div>
      <div className="flex flex-row flex-wrap justify-start">
        {Movies.map((movie) => {
          return (
            <MovieCard
              key={movie.id}
              movieObj={movie}
              poster_path={movie.poster_path}
              title={movie.title}
              watchList={watchList}
              handleWatchList={handleWatchList}
              handleRemoveWatchList={handleRemoveWatchList}
            />
          );
        })}
      </div>
      <Paging handlePage={handlePage} page={page} />
    </div>
  );
};

export default Movies;
