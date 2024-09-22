import React, { useEffect, useState } from "react";
import { CustomOverlayMap, Map, MapMarker } from "react-kakao-maps-sdk";
import SearchList from "./SearchList";
import CategorySearch from "./CategorySearch";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import useCurrentLocation from "../hooks/useCurrentLocation";

const { kakao } = window;

const KEYWORD_LIST = [
  { id: 1, value: "애견카페" },
  { id: 2, value: "동물병원" },
  { id: 3, value: "애견호텔" }
];

const SearchContent = () => {
  // 기본 위치 상태
  const [state, setState] = useState({
    center: {
      lat: 33.450701,
      lng: 126.570667
    }
  });

  const [map, setMap] = useState(null);
  const [search, setSearch] = useState([]);
  const [categoryKeyword, setCategoryKeyword] = useState("애견카페");
  const [searchId, setSearchId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastCenter, setLastCenter] = useState(null);

  const [clickKeyword, setClickKeyword] = useState("애견카페");

  /** 검색 키워드 */
  const [keyword, setKeyword] = useState("");
  const [pagination, setPagination] = useState({ current: 1, last: 1, gotoPage: () => {} });

  const navigate = useNavigate();

  // 현재 위치 정보 가져오기
  const { location, isLocationLoaded } = useCurrentLocation();

  useEffect(() => {
    if (isLocationLoaded) {
      setState({
        center: {
          lat: location.lat,
          lng: location.lng
        }
      });

      // TODO 중복코드를 어떻게 해결할까
      const places = new kakao.maps.services.Places();

      const options = {
        location: new kakao.maps.LatLng(location.lat, location.lng),
        radius: 5000,
        sort: kakao.maps.services.SortBy.DISTANCE
      };

      const placeSearch = (data, status, pagination) => {
        if (status === kakao.maps.services.Status.OK) {
          setSearch(data);
          displayPlaces(data);
          const bounds = new kakao.maps.LatLngBounds();
          data.forEach((item) => bounds.extend(new kakao.maps.LatLng(item.y, item.x)));
          map.setBounds(bounds);

          // 검색 기준 현재 위치 last좌표 저장
          const newCenter = {
            lat: location.lat,
            lng: location.lng
          };
          setLastCenter(newCenter);
          // 페이지네이션 객체 저장
          setPagination({
            current: pagination.current,
            last: pagination.last,
            gotoPage: (page) => pagination.gotoPage(page)
          });
        }
      };

      places.keywordSearch(`애견카페`, placeSearch, options);
    }
  }, [isLocationLoaded]);

  /** 사용자 검색 */
  const searchKeyword = () => {
    const places = new kakao.maps.services.Places();

    const placeSearch = (data, status, pagination) => {
      if (status === kakao.maps.services.Status.OK) {
        // setPlaces(data);
        setSearch(data);
        displayPlaces(data);
        const bounds = new kakao.maps.LatLngBounds();
        data.forEach((item) => bounds.extend(new kakao.maps.LatLng(item.y, item.x)));
        map.setBounds(bounds);
        // 페이지네이션 객체 저장
        setPagination({
          current: pagination.current,
          last: pagination.last,
          gotoPage: (page) => pagination.gotoPage(page)
        });
      }
    };

    places.keywordSearch(`${keyword} ${clickKeyword}`, placeSearch);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    searchKeyword();
  };

  const searchPlaces = (center, page) => {
    if (!state.center) return;
    const categoryps = new kakao.maps.services.Places();

    const options = {
      location: new kakao.maps.LatLng(center.lat, center.lng),
      radius: 5000,
      sort: kakao.maps.services.SortBy.DISTANCE,
      page
    };

    categoryps.keywordSearch(
      categoryKeyword,
      (data, status, categorypagination) => {
        if (status === kakao.maps.services.Status.OK) {
          setSearch(data);
          displayPlaces(data);
          const bounds = new kakao.maps.LatLngBounds();
          data.forEach((item) => bounds.extend(new kakao.maps.LatLng(item.y, item.x)));
          map.setBounds(bounds);

          // 페이지네이션 객체 저장
          setPagination({
            current: categorypagination.current,
            last: categorypagination.last,
            gotoPage: (page) => categorypagination.gotoPage(page)
          });
        } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
          setSearch(data);
        } else {
          console.log("검색 실패");
        }
      },
      options
    );
  };

  const displayPlaces = (data) => {
    const bounds = new kakao.maps.LatLngBounds();
    data.forEach((item) => bounds.extend(new kakao.maps.LatLng(item.y, item.x)));
    bounds.extend(new kakao.maps.LatLng(state.center.lat, state.center.lng));
    map.setBounds(bounds);
    setSearch(data);
  };

  // 좌표값 설정
  const moveLatLng = (data) => {
    const newLatLng = new kakao.maps.LatLng(data.y, data.x);
    map.panTo(newLatLng);
  };

  // 현재 위치 재검색
  const handleReSearch = () => {
    if (!map) return;
    const centerLatLng = map.getCenter();
    const newCenter = {
      lat: centerLatLng.getLat(),
      lng: centerLatLng.getLng()
    };
    setCurrentPage(1);
    searchPlaces(newCenter, 1);
    setLastCenter(newCenter);
  };

  /** 상단 버튼 클릭시 */
  const handleKeywordSelect = (selectedKeyword) => {
    setCategoryKeyword(selectedKeyword);
    if (lastCenter) {
      searchPlaces(lastCenter, 1);
    } else {
      searchPlaces(state.center, 1);
    }
  };

  useEffect(() => {
    if (!map) return;
    setSearchId(null);
    if (lastCenter) {
      searchPlaces(lastCenter, currentPage);
    }
  }, [map, categoryKeyword, currentPage]);

  useEffect(() => {
    if (!map) return;
    const clickListener = () => {
      setSearchId(null);
    };
    kakao.maps.event.addListener(map, "click", clickListener);
    return () => {
      kakao.maps.event.removeListener(map, "click", clickListener);
    };
  }, [map]);

  return (
    <div style={{ display: "flex" }}>
      <SearchList
        handleSubmit={handleSubmit}
        keyword={keyword}
        setKeyword={setKeyword}
        search={search}
        pagination={pagination}
        searchId={searchId}
        setSearchId={setSearchId}
        moveLatLng={moveLatLng}
      />
      <div className="relative w-full h-screen">
        <Map center={state.center} style={{ width: "100%", height: "100vh" }} level={3} onCreate={setMap}>
          <div className="flex gap-3 absolute top-0 left-0 z-10 p-4 right-0 m-[16px] font-Uhbee">
            <button className="navToggleBtn" onClick={() => navigate("/main")}>
              코스
            </button>
            <button className="navToggleBtn" onClick={handleReSearch}>
              현재 위치에서 검색
            </button>
            {KEYWORD_LIST.map((keyword) => (
              <CategorySearch
                key={keyword.id}
                keyword={keyword}
                setClickKeyword={setClickKeyword}
                handleKeywordSelect={handleKeywordSelect}
                clickKeyword={clickKeyword}
              />
            ))}
          </div>
          {search.map((data) => (
            <React.Fragment key={data.id}>
              <MapMarker
                key={data.id}
                position={{ lat: data.y, lng: data.x }}
                image={{
                  src: logo,
                  size: {
                    width: 60,
                    height: 60
                  }
                }}
                onClick={() => {
                  if (data.id === searchId) {
                    setSearchId(null);
                  } else {
                    setSearchId(data.id);
                    moveLatLng(data);
                  }
                }}
              />
              {searchId === data.id && (
                <CustomOverlayMap yAnchor={1.5} position={{ lat: data.y, lng: data.x }} clickable>
                  <div className="bg-white flex flex-col w-[300px] p-4 rounded-lg text-wrap shadow-lg">
                    <strong className="text-primary mb-4 text-[24px] font-bold font-Uhbee">{data.place_name}</strong>
                    <p className="text-[16px] mb-4">{data.address_name}</p>
                    <div className="flex justify-between text-[14px]">
                      <span>{data.phone}</span>
                      <a href={data.place_url} target="_blank">
                        홈페이지
                      </a>
                    </div>
                  </div>
                </CustomOverlayMap>
              )}
            </React.Fragment>
          ))}
        </Map>
      </div>
    </div>
  );
};

export default SearchContent;
