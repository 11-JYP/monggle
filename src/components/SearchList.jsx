import React from "react";
import SearchPagination from "./SearchPagination";

const SearchList = ({ handleSubmit, keyword, setKeyword, search, pagination, searchId, setSearchId, moveLatLng }) => {
  return (
    <div style={{ width: "30%", height: "100vh", backgroundColor: "orange", overflow: "scroll" }}>
      <form onSubmit={handleSubmit}>
        <input type="text" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
        <button type="submit">검색</button>
      </form>
      <ul style={{ display: "flex", flexDirection: "column", gap: "10px", alignItems: "center" }}>
        {search.map((place, index) => (
          <li
            key={index}
            onClick={() => {
              if (place.id === searchId) {
                setSearchId(null);
              } else {
                setSearchId(place.id);
                moveLatLng(place);
              }
            }}
            style={{ width: "80%", height: "5rem", backgroundColor: "white" }}
          >
            <div>
              <h5>{place.place_name}</h5>
              <h5>{place.road_address_name}</h5>
              <a href={place.place_url} target="_blank">
                홈페이지
              </a>
              <h5>{place.phone}</h5>
            </div>
          </li>
        ))}
      </ul>
      {/* 페이지네이션을 표시하는 부분 */}
      <SearchPagination
        currentPage={pagination.current} // 현재 페이지 상태
        lastPage={pagination.last} // 마지막 페이지 상태
        onPageChange={pagination.gotoPage} // 페이지 전환 함수
      />
    </div>
  );
};

export default SearchList;
