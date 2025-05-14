const MovieCard = ({
  movie: {
    title,
    poster_path,
    release_date,
    vote_average,
    original_language,
    overview,
  },
  handleDisplayMoreInfo,
}) => {
  return (
    <div className="movie-card" onClick={handleDisplayMoreInfo}>
      <div>
        <img
          className="poster-img"
          src={
            poster_path
              ? `https://image.tmdb.org/t/p/w500/${poster_path}`
              : "./no-movie.png"
          }
          alt={title}
        />
      </div>
      <div className="movie-info">
        <h3>{title}</h3>
        <div className="content">
          <div className="rating">
            <img src="./star.svg" alt="stars" />
            <p className="vote">
              {vote_average ? vote_average.toFixed(1) : "N/A"}
            </p>
          </div>
          <span>•</span>
          <p className="lang">
            {original_language === "en"
              ? "English"
              : original_language === "ja"
              ? "Japanese"
              : original_language === "mn"
              ? "Mongolian"
              : original_language === "es"
              ? "Spanish"
              : original_language == "ko"
              ? "Korean"
              : original_language == "hi"
              ? "Hindi"
              : original_language == "ta"
              ? "Tamil"
              : original_language == "fr"
              ? "French"
              : original_language == "th"
              ? "Thai"
              : original_language == "zh" || original_language == "cn"
              ? "Chinese"
              : original_language == "pt"
              ? "Portuguese"
              : original_language == "bn"
              ? "Bengali"
              : original_language == "de"
              ? "German"
              : original_language == "te"
              ? "Telugu"
              : original_language == "kn"
              ? "Kannada"
              : original_language == "pa"
              ? "Panjabi/Punjabi"
              : original_language || "N/A"}
          </p>
          <span>•</span>
          <p className="year">
            {release_date ? release_date.split("-")[0] : "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
