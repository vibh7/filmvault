import { Button, StepIcon, colors } from "@mui/material";
// import DeleteIcon from '@mui/icons-material/Delete'
import React, { useEffect, useState } from "react";
import poster from "../assets/starwar.jpg";
import { Delete, DisabledByDefault, PhoneEnabled } from "@mui/icons-material";
import genres from "../Utility/genre";
import { ClassNames } from "@emotion/react";

const Watchlist = ({ watchList, handleRemoveWatchList, setWatchList }) => {
  const [search, setSearch] = useState("");
  const [genreList, setGenreList] = useState(["All genre"]);
  const [currGenre,setCurrGenre] = useState("All genre")

  const sortIncrease = () => {
    let sortedIncrease = watchList.sort((movieA, movieB) => {
      return movieA.vote_average - movieB.vote_average;
    });
    setWatchList([...sortedIncrease]);
  };

  const handleCurrGenre = (genre) =>[
    setCurrGenre(genre)
  ]

  const sortDecrease = () => {
    let sortedDecrease = watchList.sort((movieA, movieB) => {
      return movieB.vote_average - movieA.vote_average;
    });
    setWatchList([...sortedDecrease]);
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  useEffect(() => {
    let temp =new Set(watchList.map((movieObj) => {
      return genres[movieObj.genre_ids[0]];
    }));
    setGenreList(["All genre",...temp])
    console.log(temp);
  }, [watchList]);

  return (
    <>
      <div className="flex my-5 flex-col justify-center items-center">
        <div className="flex align-baseline p-4 flex-wrap m-8 space-x-10 gap-5">
          {genreList.map((genre) => {
            return (
              <Button onClick={()=>{handleCurrGenre(genre)}} variant="contained" color="success" className={currGenre==genre?"bg-white":"bg-black"}>
                {genre}
              </Button>
            );
          })}
        </div>
        <input
          onChange={handleSearch}
          value={search}
          type="text"
          placeholder="Search movie"
          className="h-[3rem] w-[18rem] outline-none bg-gray-200 text-xl m-3 p-2"
        />
      </div>
      <div className=" overflow-hidden border border-gray-200 m-8">
        <table className="w-full text-gray-500 text-center">
          <thead className="border-b-2">
            <tr>
              <th>Name</th>
              <th className="flex flex-row space-x-2">
                <div
                  onClick={sortIncrease}
                  className=" cursor-pointer p-1 rounded-lg hover:bg-gray-500/30 "
                >
                  <i class="fa-solid fa-arrow-up"></i>
                </div>
                <div className="p-1">Rating</div>
                <div
                  onClick={sortDecrease}
                  className=" cursor-pointer p-1 rounded-lg hover:bg-gray-500/30 "
                >
                  <i class="fa-solid fa-arrow-down"></i>
                </div>
              </th>
              <th>Popularity</th>
              <th>Genre</th>
            </tr>
          </thead>
          <tbody>
            {watchList.filter((movieObj)=>{
              if(currGenre=="All genre"){
                return true
              }else{
                return genres[movieObj.genre_ids[0]]==currGenre;
              }

            })
              .filter((movieObj) => {
                return movieObj.title
                  .toLowerCase()
                  .includes(search.toLocaleLowerCase());
              })
              .map((movieObj) => {
                return (
                  <tr className="border-b-2">
                    <td className="flex items-center px-6 py-4">
                      <img
                        src={`https://image.tmdb.org/t/p/original/${movieObj.poster_path}`}
                        alt=""
                        className="h-[12rem] "
                      />
                      <div className="mx-10">{movieObj.title}</div>
                    </td>
                    <td>{movieObj.vote_average}</td>
                    <td>{movieObj.popularity}</td>
                    <td>{genres[movieObj.genre_ids[0]]}</td>
                    <td>
                      <Button
                        variant="outlined"
                        startIcon={<Delete />}
                        onClick={() => {
                          handleRemoveWatchList(movieObj);
                        }}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Watchlist;
