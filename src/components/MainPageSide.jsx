import axios from "axios";
import { useEffect, useState } from "react";
import fetchCoordinatesByRegion from "../api/fetchCoordinatesByRegion";
import { useNavigate } from "react-router-dom";
import home from "../assets/home.png";

const MainPageSide = ({ updateMapCenter }) => {
  const navigate = useNavigate();

  const [routesInfo, setRoutesInfo] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [filteredRoutesInfo, setFilteredRoutesInfo] = useState([]);
  const [searchType, setSearchType] = useState("routeName");
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
        <div className="flex flex-col justify-center items-center gap-6 m-[20px]">
          <div className="w-24 py-4">
            <img src={home} />
          </div>

          <button
            className="w-full h-[40px] bg-primary rounded-full text-white hover:bg-secondary-200 transition-all"
            onClick={() => {
              navigate("/walkpath");
            }}
          >
            산책로 만들기
          </button>

          <form onSubmit={handleSearchSubmit} className="w-full">
            <div className="flex justify-center align-middle gap-5 mb-4">
              <button
                type="button"
                className={`px-4 py-2 rounded-md border font-semibold ${
                  searchType === "routeName"
                    ? "bg-primary text-white border-secondary-200"
                    : "bg-white border-secondary-200"
                }`}
                onClick={() => setSearchType("routeName")}
              >
                산책이름
              </button>
              <button
                type="button"
                className={`px-4 py-2 rounded-md border font-semibold ${
                  searchType === "region" ? "bg-primary text-white border-orange-500" : "bg-white border-secondary-200"
                }`}
                onClick={() => setSearchType("region")}
              >
                지역이름
              </button>
            </div>
            <div className="flex justify-between">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => {
                  setSearchInput(e.target.value);
                }}
                placeholder={placeholderText}
                className="input w-4/5"
              />
              <button
                type="submit"
                className="bg-primary px-2 rounded-md text-sm text-white font-semibold  hover:bg-secondary-200 transition-all"
              >
                검색
              </button>
            </div>
          </form>
        </div>
        <div className="mt-2">
          {filteredRoutesInfo.map((info) => {
            const position = info.paths[0];
            return (
              <div
                key={info.id}
                className=" mx-2 p-4 border-[1px] border-solid border-gray-200 rounded-md cursor-pointer hover:border-secondary-200 transition-all"
                onClick={() => updateMapCenter(position)}
              >
                <h1 className="font-bold text-secondary-200 text-lg">{info.routeName}</h1>
                <p className="py-2">{info.address}</p>
                <span className="text-gray-600 text-sm">{info.description}</span>
                <p>{info.region}</p>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default MainPageSide;
