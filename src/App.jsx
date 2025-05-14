import React, { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";
import "./App.css";
import Pagination from "./components/Pagination.jsx";
import Search from "./components/search";
import Spinner from "./components/Spinner";
import MovieCard from "./components/MovieCard";

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  methods: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [movieList, setMovieList] = useState([]);
  const [movieMoreInfo, setMovieMoreInfo] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTermDebounce] = useDebounce(searchTerm, 500);
  const [displayMoreInfo, setDisplayMoreInfo] = useState(false);
  const [pages, setPages] = useState(1);
  const [firstPage, setFirstPage] = useState("");
  const [pageWarning, setPageWarning] = useState(".");

  const fetchMovies = async (query) => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const endpoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc&page=${pages}`;
      const response = await fetch(endpoint, API_OPTIONS);
      if (!response.ok) {
        throw new Error("Failed to fetch movies!");
      }

      const data = await response.json();
      if (data.Response === "false") {
        setErrorMessage(data.Error || "Failed to fetch movies!");
        setMovieList([]);
        return;
      }
      setMovieList(data.results || []);
    } catch (error) {
      setErrorMessage("Fetching Movies Failed, Please Try Again!");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies(searchTermDebounce);
  }, [searchTermDebounce, pages]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setDisplayMoreInfo(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
  function handleDisplayMoreInfo(
    title,
    overview,
    posterPath,
    releaseDate,
    voteAverage,
    originalLanguage,
    voteCount
  ) {
    setDisplayMoreInfo((prev) => !prev);
    setMovieMoreInfo({
      movieTitle: title,
      movieOverview: overview,
      moviePosterPath: posterPath,
      movieReleaseDate: releaseDate,
      movieVoteAverage: voteAverage,
      movieOriginalLanguage: originalLanguage,
      movieVoteCount: voteCount,
    });
  }

  function handlePagesNext() {
    setPages(pages + 1);
    setPageWarning(".");
    setFirstPage("");
    window.scrollTo({
      top: 60,
      behavior: "smooth",
    });
    console.log(pages);
  }
  function handlePagesPrev() {
    if (pages == 1) {
      setFirstPage(1);
      setPages(1);
      setPageWarning("You have reached the first page.");
    } else {
      window.scrollTo({
        top: 60,
        behavior: "smooth",
      });
      setFirstPage("");
      setPages(pages - 1);
      setPageWarning(".");
    }
  }

  return (
    <main>
      <div className="wrapper">
        <header>
          {isLoading ? (
            <div className="posters-head">
              <img
                className="head1"
                src={"./poster1.jpg " || "./no-movie.png"}
              />
              <img
                className="head2"
                src={"./poster2.jpg " || "./no-movie.png"}
              />
              <img
                className="head3"
                src={"./poster3.jpg " || "./no-movie.png"}
              />
            </div>
          ) : movieList.length > 0 ? (
            <div className="posters-head">
              <img
                className="head1"
                src={
                  movieList[0]?.poster_path
                    ? `https://image.tmdb.org/t/p/w500/${movieList[0].poster_path}`
                    : "./no-movie.png"
                }
                alt={movieList[0]?.title || "Head Poster 1"}
              />
              <img
                className="head2"
                src={
                  movieList[1]?.poster_path
                    ? `https://image.tmdb.org/t/p/w500/${movieList[1].poster_path}`
                    : "./no-movie.png"
                }
                alt={movieList[1]?.title || "Head Poster 2"}
              />

              <img
                className="head3"
                src={
                  movieList[2]?.poster_path
                    ? `https://image.tmdb.org/t/p/w500/${movieList[2].poster_path}`
                    : "./no-movie.png"
                }
                alt={movieList[2]?.title || "Head Poster 3"}
              />
            </div>
          ) : (
            <div className="posters-head">
              <img
                className="head1"
                src={"./poster1.jpg " || "./no-movie.png"}
              />
              <img
                className="head2"
                src={"./poster2.jpg " || "./no-movie.png"}
              />
              <img
                className="head3"
                src={"./poster3.jpg " || "./no-movie.png"}
              />
            </div>
          )}

          <h1>
            Experience <span className="gradient-h1">Cinematic Magic</span> with
            Zero Complications
          </h1>
        </header>
        <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        {isLoading ? (
          <Spinner />
        ) : errorMessage ? (
          <p className="text-red-500">{errorMessage} </p>
        ) : (
          <div className="all-movies">
            {movieList.filter((movie) =>
              movie.title
                .toLowerCase()
                .includes(searchTermDebounce.toLowerCase())
            ).length > 0 ? (
              movieList.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  handleDisplayMoreInfo={() => {
                    handleDisplayMoreInfo(
                      movie.title,
                      movie.overview,
                      movie.poster_path,
                      movie.release_date,
                      movie.vote_average,
                      movie.original_language,
                      movie.vote_count
                    );
                  }}
                />
              ))
            ) : (
              <p className="text-white mt-5">
                No movie found with the name <b>"{searchTermDebounce}"</b>, try
                again.
              </p>
            )}
            {/* {movieList.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))} */}
          </div>
        )}

        {/* {firstPage && <p className="page-warning">{pageWarning}</p>} */}
        {movieList.length && !searchTerm.length && !isLoading && (
          <>
            <hr />
            <p className="page-warning">{pageWarning}</p>
            <div className="pagination-div">
              <span className="pages-btn" onClick={handlePagesPrev}>
                Back
              </span>
              <span className="page-no">{pages}</span>
              <span className="pages-btn" onClick={handlePagesNext}>
                Next
              </span>
            </div>
          </>
        )}
      </div>

      {displayMoreInfo && (
        <div className="wrapper-more-info">
          <div className="outer-more-info">
            <div className="more-info">
              <div className="cross" onClick={handleDisplayMoreInfo}>
                <p>X</p>
              </div>
              <div className="poster-col">
                <img
                  src={
                    movieMoreInfo.moviePosterPath
                      ? `https://image.tmdb.org/t/p/w500/${movieMoreInfo.moviePosterPath}`
                      : "./no-movie.png"
                  }
                  alt=""
                />
              </div>
              <div className="more-info-details">
                <h1>
                  {movieMoreInfo.movieTitle ? movieMoreInfo.movieTitle : "N/A"}
                </h1>
                <div className="content" style={{ marginTop: "15px" }}>
                  <div className="rating">
                    <img src="./star.svg" alt="stars" />
                    <p className="vote">
                      {movieMoreInfo.movieVoteAverage
                        ? movieMoreInfo.movieVoteAverage.toFixed(1)
                        : "N/A"}
                    </p>
                  </div>
                  <span>•</span>
                  <p className="vote">
                    {movieMoreInfo.movieVoteCount
                      ? movieMoreInfo.movieVoteCount
                      : "N/A"}{" "}
                    (Voters)
                  </p>
                </div>
                <div className="overview-and-more">
                  <h3>Overview</h3>
                  <p className="overview">
                    {movieMoreInfo.movieOverview
                      ? movieMoreInfo.movieOverview
                      : "N/A"}
                  </p>
                  <h3 style={{ marginTop: "8px" }}>
                    Language:{" "}
                    <span className="lan-date">
                      {movieMoreInfo.movieOriginalLanguage === "en"
                        ? "English"
                        : movieMoreInfo.movieOriginalLanguage === "ja"
                        ? "Japanese"
                        : movieMoreInfo.movieOriginalLanguage === "mn"
                        ? "Mongolian"
                        : movieMoreInfo.movieOriginalLanguage === "es"
                        ? "Spanish"
                        : movieMoreInfo.movieOriginalLanguage == "ko"
                        ? "Korean"
                        : movieMoreInfo.movieOriginalLanguage == "hi"
                        ? "Hindi"
                        : movieMoreInfo.movieOriginalLanguage == "ta"
                        ? "Tamil"
                        : movieMoreInfo.movieOriginalLanguage == "fr"
                        ? "French"
                        : movieMoreInfo.movieOriginalLanguage == "th"
                        ? "Thai"
                        : movieMoreInfo.movieOriginalLanguage == "zh" ||
                          movieMoreInfo.movieOriginalLanguage == "cn"
                        ? "Chinese"
                        : movieMoreInfo.movieOriginalLanguage == "pt"
                        ? "Portuguese"
                        : movieMoreInfo.movieOriginalLanguage == "bn"
                        ? "Bengali"
                        : movieMoreInfo.movieOriginalLanguage == "de"
                        ? "German"
                        : movieMoreInfo.movieOriginalLanguage == "te"
                        ? "Telugu"
                        : movieMoreInfo.movieOriginalLanguage == "kn"
                        ? "Kannada"
                        : movieMoreInfo.movieOriginalLanguage == "pa"
                        ? "Panjabi/Punjabi"
                        : movieMoreInfo.movieOriginalLanguage || "N/A"}
                    </span>
                  </h3>
                  <h3 style={{ marginTop: "8px" }}>
                    Release Date:{" "}
                    <span className="lan-date">
                      {movieMoreInfo.movieReleaseDate
                        ? movieMoreInfo.movieReleaseDate
                        : "N/A"}
                    </span>
                  </h3>
                  <div className="close-div">
                    <button
                      className="close-btn"
                      onClick={handleDisplayMoreInfo}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="creator-credit">Created by rizwanPizzee</div>
    </main>
  );
}

export default App;
