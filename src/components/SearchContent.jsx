import React, { useEffect, useState } from "react";
import { CustomOverlayMap, Map, MapMarker } from "react-kakao-maps-sdk";
import SearchList from "./SearchList";
import CategorySearch from "./CategorySearch";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

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
    },
    errMsg: null,
    isLoading: true
  });

  const [map, setMap] = useState(null);
  const [search, setSearch] = useState([]);
  const [categoryKeyword, setCategoryKeyword] = useState("애견카페");
  const [categorypagination, setCategoryPagination] = useState(null);
  const [searchId, setSearchId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastCenter, setLastCenter] = useState(null);

  const [info, setInfo] = useState();
  const [markers, setMarkers] = useState([]);

  const [clickKeyword, setClickKeyword] = useState("");
  //민지님 코드
  /** 검색 결과 */
  // const [places, setPlaces] = useState([]);

  /** 검색 키워드 */
  const [keyword, setKeyword] = useState("");

  const [pagination, setPagination] = useState({ current: 1, last: 1, gotoPage: () => {} });

  const navigate = useNavigate();

  useEffect(() => {
    if (navigator.geolocation) {
      // GeoLocation을 이용해서 접속 위치를 얻어옵니다
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setState((prev) => ({
            ...prev,
            center: {
              lat: position.coords.latitude, // 위도
              lng: position.coords.longitude // 경도
            },
            isLoading: false
          }));
        },
        (err) => {
          setState((prev) => ({
            ...prev,
            errMsg: err.message,
            isLoading: false
          }));
        }
      );
    } else {
      // HTML5의 GeoLocation을 사용할 수 없을때 마커 표시 위치와 인포윈도우 내용을 설정합니다
      setState((prev) => ({
        ...prev,
        errMsg: "geolocation을 사용할수 없어요..",
        isLoading: false
      }));
    }
  }, []);

  /** 사용자 검색 */
  const searchKeyword = () => {
    const places = new kakao.maps.services.Places();

    const placeSearch = (data, status, pagination) => {
      if (status === kakao.maps.services.Status.OK) {
        // setPlaces(data);
        setSearch(data);
        displayPlaces(data); // TODO 변경사항
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
  //민지님 코드

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
          // setPlaces(data);
          setSearch(data);
          displayPlaces(data);
          const bounds = new kakao.maps.LatLngBounds();
          data.forEach((item) => bounds.extend(new kakao.maps.LatLng(item.y, item.x)));
          map.setBounds(bounds);
          // setCategoryPagination(categorypagination);

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

    console.log(data);
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
    console.log(centerLatLng);
    console.log(newCenter);
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
    } else {
      searchPlaces(state.center, currentPage);
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
        <Map
          center={state.center}
          style={{ width: "100%", height: "calc(100vh - 109px)", marginTop: "48px" }}
          level={3}
          onCreate={setMap}
        >
          <div className="flex absolute top-0 left-0 z-10 p-4 w-full">
            <button className="navToggleBtn" onClick={() => navigate("/")}>
              코스
            </button>
            <button className="navToggleBtn" onClick={handleReSearch}>
              현재 위치에서 검색
            </button>
            {KEYWORD_LIST.map((keyword) => (
              <CategorySearch
                keyword={keyword}
                setClickKeyword={setClickKeyword}
                handleKeywordSelect={handleKeywordSelect}
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
                <CustomOverlayMap yAnchor={2.1} position={{ lat: data.y, lng: data.x }} clickable>
                  <p>{data.place_name}</p>
                  <strong>{data.address_name}</strong>
                  <span>{data.phone}</span>
                  <a href={data.place_url} target="_blank">
                    주소
                  </a>
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
