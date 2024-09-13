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
    <div>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={searchText}
          onChange={(e) => {
            setSearchText(e.target.value);
          }}
          placeholder="산책 루트 명을 입력하세요."
        />
        <button type="submit"> 검색</button>
      </form>
      <div>
        {filteredRoutes.length > 0 ? (
          filteredRoutes.map((route) => (
            <div key={route.id}>
              <h3>{route.name}</h3>
              <p>{route.description}</p>
              <p>거리: {route.distance} km</p>
              <p>시간: {route.time}</p>
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
