import React, { useMemo, useState } from "react";
import ReactDOM from "react-dom";
import "./index.css";
import Cards from "./Cards";

// 1. Please have all the coding in one single file
// 2. Styling is unnecessary
// 3. Call Search API upon every text input
// 4. Apply debounce
// 5. Return the search result in thumbnail grid list (ex: google image search result)
// 6. Limit 15 results a page and provide previous/next buttons

// Search API
const sampleSearchUrl =
  "https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=45f3250ea1007f942d0e60c3d600da01&text={SEARCH_KEYWORD}&format=json&nojsoncallback=1&per_page=15&page=1";

// Image URL
const sampleImageUrl =
  "https://farm{farm}.staticflickr.com/{server}/{id}_{secret}_t.jpg";

const debounce = (cb, waitTime, context) => {
  let timer = null;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      cb.apply(context, args);
    }, waitTime)
  }
}

const useDebounceInput = (setFunc) => {

  const wrapperData = (e) => {
    const fetchData = async () => {
      const apiUrl = sampleSearchUrl.replace("{SEARCH_KEYWORD}", e.value);
      const jsonData = await fetch(apiUrl);
      return await jsonData.json();
    };

    fetchData().then((data) => {
      setFunc(data.photos.photo);
    });
  };

  return debounce(wrapperData, 1000);
}

function PrevPageIndex({ page }) {
  if (page > 1) {
    return <span></span>
  }

  return <></>
}

const App = () => {
  const [list, setList] = useState([]);
  const [page, setPage] = useState(1);

  const [more, setMore] = useState(true);

  const aa = useDebounceInput(setList)


  function handleChange1(event) {
    aa(event);
  }

  function handleChange(event) {
    const fetchData = async () => {
      const apiUrl = sampleSearchUrl.replace("{SEARCH_KEYWORD}", event.value);
      const jsonData = await fetch(apiUrl);
      return await jsonData.json();
    };

    fetchData().then((data) => {
      setList(data.photos.photo);
    });
  }

  function handlePageClick(flag) {
    if (flag === 'next') {
      setPage((prev) => {
        return prev + 1;
      })
    } else {
      setPage((prev) => {
        return prev - 1;
      })
    }
  }

  function handleViewClick() {
    setMore((prev) => !prev);
  }

  let prevButton = <></>;
  if (page > 1) {
    prevButton = <span onClick={handlePageClick}>prev page</span>
  }

  return (
    <div className="App">
      <h1>Photo Search</h1>
      <input type="text" onChange={handleChange1} />

      <div className={`image-container ${more ? "more" : "less"}`}>
        <div className="layer"></div>
        <div className="view-omission" onClick={handleViewClick}>
          {more ? 'view more' : 'view less'}
        </div>
        {list.map((item, index) => {
          let imageUrl = sampleImageUrl.replace("{farm}", item.farm);
          imageUrl = imageUrl.replace("{server}", item.server);
          imageUrl = imageUrl.replace("{id}", item.id);
          imageUrl = imageUrl.replace("{secret}", item.secret);
          return <div key={index}>
            <img src={imageUrl} alt="ignore" />
          </div>;
        })}
      </div>

      <div>
        {prevButton}
        <span onClick={() => {
          handlePageClick('next')
        }}>next page</span>
      </div>

      <div className="cards-container">
        <Cards></Cards>
      </div>

    </div>
  );
};

export default App;