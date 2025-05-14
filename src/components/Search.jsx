const Search = ({ searchTerm, setSearchTerm }) => {
  return (
    <>
      <label className="label-search" htmlFor="search-input">
        <div className="search-section">
          <div>
            <label htmlFor="search-input">
              <img src="./search.svg" alt="search svg" />
            </label>
          </div>
          <div>
            <input
              id="search-input"
              value={searchTerm}
              type="text"
              placeholder="Search through 100 000+ movies"
              onChange={(e) => {
                setSearchTerm(e.target.value);
              }}
            />
          </div>
        </div>
      </label>
      <div className="search">
        <div>
          <h2>Trending Movies</h2>
        </div>
      </div>
      {/* <div className="search">
        <div>
          <h2>Trending Movies</h2>
        </div>
        <label htmlFor="search-input">
          <div className="search-section">
            <label htmlFor="search-input">
              <img src="./search.svg" alt="search svg" />
            </label>
            <input
              id="search-input"
              value={searchTerm}
              type="text"
              placeholder="Search through 100 000+ movies"
              onChange={(e) => {
                setSearchTerm(e.target.value);
              }}
            />
          </div>
        </label>
      </div> */}
    </>
  );
};

export default Search;
