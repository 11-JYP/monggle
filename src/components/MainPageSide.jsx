import axios from "axios";
import { useEffect, useState } from "react";

const MainPageSide = () => {
  const [routesInfo, setRoutesInfo] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [filteredRoutesInfo, setFilteredRoutesInfo] = useState([]);

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

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const results = routesInfo.filter((route) =>
      route.routeName.trim().toLowerCase().includes(searchInput.trim().toLowerCase())
    );
    console.log("필터링 된 검색 결과 => ", results);
    if (searchInput.length === 0) {
      alert("검색어를 입력해주세요");
    } else {
      setFilteredRoutesInfo(results);
    }
  };

  return (
    <>
      <div className="sideContainer">
        <div className="flex flex-col justify-center items-center gap-10 m-[20px]">
          <h1 className="text-orange">몽글로드</h1>
          <form onSubmit={handleSearchSubmit} className="w-full">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
              }}
              placeholder="산책 이름이나 지역을 입력해주세요."
              className="w-full"
            />
            <button>검색</button>
          </form>
        </div>
        <div>
          {filteredRoutesInfo.map((routeInfo) => {
            return (
              <div key={routeInfo.id} className="w-full p-[20px] bg-red-400 mb-[20px]">
                <div>{routeInfo.routeName}</div>
                <div>{routeInfo.address}</div>
                <div>{routeInfo.description}</div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default MainPageSide;
