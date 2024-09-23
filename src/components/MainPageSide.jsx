import { useState, useEffect } from "react";
import axios from "axios";
import fetchCoordinatesByRegion from "../api/fetchCoordinatesByRegion";
import { useNavigate } from "react-router-dom";
import home from "../assets/home.png";

const MainPageSide = ({ updateMapCenter }) => {
  const navigate = useNavigate();
  const [routesInfo, setRoutesInfo] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [filteredRoutesInfo, setFilteredRoutesInfo] = useState([]);
  const [searchType, setSearchType] = useState("routeName");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const getRoutesInfo = async () => {
      try {
        const response = await axios.get("https://best-fresh-mojoceratops.glitch.me/Route");

        setRoutesInfo(response.data);
        setFilteredRoutesInfo(response.data);
      } catch (error) {
        console.log("데이터를 불러오지 못했습니다.", error);
      }
    };
    getRoutesInfo();
  }, []);

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    const searchTerm = searchInput.trim().toLowerCase();

    if (searchType === "routeName") {
      const results = routesInfo.filter((route) => route.routeName.toLowerCase().includes(searchTerm));
      setFilteredRoutesInfo(results);
    } else if (searchType === "region") {
      try {
        const { lat, lng } = await fetchCoordinatesByRegion(searchTerm);
        const results = routesInfo.filter((route) => route.region && route.region.toLowerCase().includes(searchTerm));
        setFilteredRoutesInfo(results);
        updateMapCenter({ lat, lng });
      } catch (error) {
        alert(error.message);
      }
    }
    setCurrentPage(1);
  };

  // 총 페이지 수 계산
  const totalPages = Math.ceil(filteredRoutesInfo.length / itemsPerPage);

  const currentItems = filteredRoutesInfo.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // 페이지 번호 렌더링 함수
  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`mx-1 px-3 py-1 ${i === currentPage ? " text-[orange]" : "text-gray-700"}`}
        >
          {i}
        </button>
      );
    }
    return pageNumbers;
  };

  const placeholderText = searchType === "routeName" ? "몽글로드를 입력해주세요." : "지역명을 입력해주세요.";

  return (
    <div className="sideContainer">
      <div className="flex flex-col justify-center items-center gap-6 m-[20px]">
        <div className="w-20 py-4">
          <img src={home} alt="Home" />
        </div>

        <button
          className="w-full h-[45px] bg-primary rounded-full text-white hover:bg-secondary-200 transition-all font-Uhbee"
          onClick={() => navigate("/walkpath")}
        >
          몽글로드 만들기
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
              onClick={() => {
                setSearchType("routeName");
                setSearchInput("");
              }}
            >
              몽글로드
            </button>
            <button
              type="button"
              className={`px-4 py-2 rounded-md border font-semibold ${
                searchType === "region" ? "bg-primary text-white border-orange-500" : "bg-white border-secondary-200"
              }`}
              onClick={() => {
                setSearchType("region");
                setSearchInput("");
              }}
            >
              지역이름
            </button>
          </div>
          <div className="flex justify-between">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder={placeholderText}
              className="input w-4/5"
            />
            <button
              type="submit"
              className="bg-primary px-2 rounded-md text-sm text-white font-semibold hover:bg-secondary-200 transition-all"
            >
              검색
            </button>
          </div>
        </form>
      </div>

      <div className="mt-2 overflow-y-auto h-[100vh]">
        {currentItems.length > 0 ? (
          currentItems.map((info) => (
            <div
              key={info.id}
              className="mx-2 mb-4 border-[1px] border-solid border-gray-200 rounded-md cursor-pointer hover:border-secondary-200 transition-all"
              onClick={() => updateMapCenter(info.paths[0])}
            >
              <h1 className="font-bold text-secondary-200 text-lg py-3 px-4 font-Uhbee">{info.routeName}</h1>
              <p className="py-2 px-4">{info.address}</p>
              <span className="text-gray-600 text-sm px-4">{info.description}</span>
              <p>{info.region}</p>
              <div className="bg-secondary-100 flex justify-center gap-4 p-4 mt-2 rounded-b-md font-bold text-secondary-200">
                <span className="inline-block">총 거리 : {Math.floor(info.totalDistance)} m</span>
                <span className="inline-block">소요 시간 : {info.totalWalkkTime} 분</span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 font-Uhbee">검색 결과가 없습니다.</p>
        )}
      </div>

      <div className="flex justify-center my-4 font-Uhbee">{renderPageNumbers()}</div>
    </div>
  );
};

export default MainPageSide;
