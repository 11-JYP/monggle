import React from "react";
import SearchPagination from "./SearchPagination";

import searchHome from "../assets/searchHome.png";
import searchGlasses from "../assets/search.png";

const SearchList = ({ handleSubmit, keyword, setKeyword, search, pagination, searchId, setSearchId, moveLatLng }) => {
  return (
    <div className="sideContainer h-screen bg-[#FF7B00]  overflow-scroll gap-8 py-5">
      <form className="flex justify-center gap-2 relative" onSubmit={handleSubmit}>
        <input
          placeholder={"예) 역삼동, 테혜란로"}
          className="rounded-md w-4/5 h-10"
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <button type="submit" className="absolute right-10 top-1/2 transform -translate-y-1/2">
          <img src={searchGlasses} className="h-[2em]" />
        </button>
      </form>
      <ul className="flex flex-col gap-2.5 items-center">
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
            className="rounded-lg w-4/5  bg-white p-3"
          >
            <div className="flex flex-col gap-6">
              <div>
                <h5 className="font-bold text-lg">{place.place_name}</h5>
                <h5 className="text-sm">{place.road_address_name}</h5>
              </div>
              <div className="flex justify-between">
                <div className="flex items-center">
                  {/* <img className="w-4" src={tel} /> */}
                  <h5>{place.phone}</h5>
                </div>
                <div className="flex items-center gap-0.5">
                  <img className="h-[1em]" src={searchHome} />
                  <a href={place.place_url} target="_blank">
                    홈페이지
                  </a>
                </div>
              </div>
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
