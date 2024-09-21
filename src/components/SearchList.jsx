import React, { useRef } from "react";
import SearchPagination from "./SearchPagination";
import home from "../assets/home.png";

import searchHome from "../assets/searchHome.png";

const SearchList = ({ handleSubmit, keyword, setKeyword, search, pagination, searchId, setSearchId, moveLatLng }) => {
  const scroll = useRef();

  const scrollToTop = () => {
    scroll.current.scrollTop = 0;
  };

  return (
    <div className="sideContainer  h-screen">
      <div className="flex flex-col justify-center items-center gap-6 m-[20px]">
        <div className="w-20 py-4">
          <img src={home} alt="Home" />
        </div>

        <form onSubmit={handleSubmit} className="w-full">
          <div className="flex justify-between">
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder={"예) 역삼동, 언주로"}
              className="input w-4/5"
            />
            <button
              type="submit"
              className="bg-primary px-2 rounded-md text-sm font-Uhbee text-white font-semibold hover:bg-secondary-200 transition-all"
            >
              검색
            </button>
          </div>
        </form>
      </div>

      <div ref={scroll} className="mt-2 overflow-scroll scroll-smooth h-[100vh]">
        {search.length > 0 ? (
          search.map((place, index) => (
            <div
              key={index}
              className="mx-2 mb-4 border-[1px] border-solid border-gray-200 rounded-md cursor-pointer hover:border-secondary-200 transition-all"
              onClick={() => {
                if (place.id === searchId) {
                  setSearchId(null);
                } else {
                  setSearchId(place.id);
                  moveLatLng(place);
                }
              }}
            >
              <h1 className="font-bold font-Uhbee text-secondary-200 text-lg pt-4 px-4">{place.place_name}</h1>
              <p className="py-2 px-4">{place.road_address_name}</p>

              <div className="bg-secondary-100 flex justify-between gap-4 p-4 mt-2 rounded-b-md font-bold text-secondary-200">
                <span className="inline-block">{place.phone}</span>
                <div className="flex gap-1 ">
                  <img src={searchHome} className="h-[1em]" />
                  <a href={place.place_url} target="_blank">
                    홈페이지
                  </a>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">검색 결과가 없습니다.</p>
        )}
      </div>

      {/* 페이지네이션을 표시하는 부분 */}
      <SearchPagination
        currentPage={pagination.current} // 현재 페이지 상태
        lastPage={pagination.last} // 마지막 페이지 상태
        onPageChange={pagination.gotoPage} // 페이지 전환 함수
        scrollToTop={scrollToTop}
      />
    </div>
  );
};

export default SearchList;
