import { useState, useEffect, useRef } from "react";

const SearchAuto = () => {
  const [display, setDisplay] = useState(false);
  const [options, setOptions] = useState([]);
  const [search, setSearch] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const wrapperRef = useRef(null);

  useEffect(() => {
    fetch("/api/v1/cities")
      .then((response) => {
        //console.log(response);
        if (!response.ok) {
          throw Error("could not fetch data from resource");
        }
        return response.json();
      })
      .then((data) => {
        setOptions(data.map((item) => item.name));
      })
      .catch((errMsg) => {
        //console.log(errMsg.message);
        setErrorMessage(errMsg.message);
      });
  }, []);

  const setSearchCity = (searchCity) => {
    //console.log(searchCity);
    setSearch(searchCity);
    setDisplay(false);
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleClickOutside = (event) => {
    const { current: wrap } = wrapperRef;
    if (wrap && !wrap.contains(event.target)) {
      setDisplay(false);
    }
  };

  return (
    <div ref={wrapperRef} className="flex-container flex-column pos-rel">
      {errorMessage && <strong className="error-text">{errorMessage}</strong>}
      <input
        id="auto"
        onClick={() => setDisplay(!display)}
        placeholder="Type to search"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />
      {display && (
        <div className="autoContainer">
          {options
            .filter((city) => {
              return city.toLowerCase().indexOf(search.toLowerCase()) > -1;
            })
            .map((v, i) => {
              //console.log(i + " " + v);
              return (
                <div
                  onClick={() => setSearchCity(v)}
                  className="option"
                  key={i}
                  tabIndex="0"
                >
                  <span>{v}</span>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
};

export default SearchAuto;
