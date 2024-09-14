import axios from "axios";
import { useEffect, useState } from "react";

const RouteSearch = () => {
  const [routes, setRoutes] = useState([]); // 산책코스 배열 저장
  const [searchText, setSearchText] = useState(""); // 검색어 관리
  const [filteredRoutes, setFilteredRoutes] = useState([]); // 필터링 루트

  //루트 불러오는 로직
  useEffect(() => {
    const getRoutes = async () => {
      try {
        const response = await axios.get("http://localhost:4000/routes");
        console.log("산책코스리스트", response);
        setRoutes(response.data);
      } catch (error) {
        console.log("데이터를 불러오지 못했습니다.", error);
      }
    };

    getRoutes();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const results = routes.filter((route) => route.name.includes(searchText.trim()));
    console.log("필터링된 결과:", results); // 필터링된 결과 확인
    setFilteredRoutes(results); // 필터링된 결과 설정
  };

  return (
    <div className="absolute top-0 left-0 z-10 h-screen bg-primary flex flex-col p-3">
      <form onSubmit={handleSearch} className="flex justify-center gap-2 mt-6">
        <input
          type="text"
          value={searchText}
          onChange={(e) => {
            setSearchText(e.target.value);
          }}
          placeholder="산책 루트 명을 입력하세요."
          className="w-9/12 p-2 rounded-sm"
        />
        <button type="submit" className="p-2 rounded-sm  bg-secondary-100">
          검색
        </button>
      </form>
      <div className="mt-10">
        {filteredRoutes.length > 0 ? (
          filteredRoutes.map((route) => (
            <div key={route.id} className="bg-white rounded-md my-3">
              <h3 className="font-bold p-3 text-lg text-left">{route.name}</h3>
              <p className=" mb-2 p-3 text-left text-sm">{route.description}</p>
              <div className="flex gap-5 p-5 bg-secondary-100 rounded-b-md">
                <span>거리: {route.distance} km</span>
                <span>시간: {route.time}</span>
              </div>
            </div>
          ))
        ) : (
          <p>검색 결과가 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default RouteSearch;
