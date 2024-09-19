import axios from "axios";
import { useEffect, useState } from "react";
import fetchCoordinatesByRegion from "../api/fetchCoordinatesByRegion";

const MainPageSide = ({ updateMapCenter }) => {
  const [routesInfo, setRoutesInfo] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [filteredRoutesInfo, setFilteredRoutesInfo] = useState([]);
  const [searchType, setSearchType] = useState("routeName"); // State to differentiate between route and region search

  useEffect(() => {
    const getRoutesInfo = async () => {
      try {
        const response = await axios.get("http://localhost:4005/Route");
        console.log("코스정보 =>", response);
        setRoutesInfo(response.data);
      } catch (error) {
        console.log("데이터를 불러오지 못했습니다.", error);
      }
    };

    getRoutesInfo();
  }, []);

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    const searchTerm = searchInput.trim().toLowerCase();

    // 선택된 토글이 산책이름인 경우
    if (searchType === "routeName") {
      const results = routesInfo.filter((route) => route.routeName.toLowerCase().includes(searchTerm));
      setFilteredRoutesInfo(results);
    } else if (searchType === "region") {
      // 선택된 토글이 지역명인 경우
      try {
        const { lat, lng } = await fetchCoordinatesByRegion(searchTerm);
        const results = routesInfo.filter((route) => route.region && route.region.toLowerCase().includes(searchTerm));
        setFilteredRoutesInfo(results);
        updateMapCenter({ lat, lng }); // 좌표를 기반으로 지도 중심을 업데이트
      } catch (error) {
        alert(error.message);
      }
    }
  };
  const placeholderText = searchType === "routeName" ? "산책 이름을 입력해주세요." : "지역명을 입력해주세요.";
  return (
    <>
      <div className="sideContainer">
        <div className="flex flex-col justify-center items-center gap-10 m-[20px]">
          <h1 className="text-orange">몽글로드</h1>
          <form onSubmit={handleSearchSubmit} className="w-full">
            <div className="flex gap-4 mb-4">
              <button
                type="button"
                className={`px-4 py-2 rounded-md border font-semibold ${
                  searchType === "routeName"
                    ? "bg-orange-500 text-white border-orange-500"
                    : "bg-gray-200 text-gray-700 border-gray-300"
                }`}
                onClick={() => setSearchType("routeName")}
              >
                산책이름
              </button>
              <button
                type="button"
                className={`px-4 py-2 rounded-md border font-semibold ${
                  searchType === "region"
                    ? "bg-orange-500 text-white border-orange-500"
                    : "bg-gray-200 text-gray-700 border-gray-300"
                }`}
                onClick={() => setSearchType("region")}
              >
                지역이름
              </button>
            </div>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
              }}
              placeholder={placeholderText}
              className="w-full"
            />
            <button type="submit">검색</button>
          </form>
        </div>
        <div>
          {filteredRoutesInfo.map((info) => {
            const position = info.paths[0];
            return (
              <div
                key={info.id}
                className="w-full p-[20px] bg-red-400 mb-[20px]"
                onClick={() => updateMapCenter(position)}
              >
                <div>{info.routeName}</div>
                <div>{info.address}</div>
                <div>{info.description}</div>
                <div>{info.region}</div> {/* Display region or any other field */}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default MainPageSide;
