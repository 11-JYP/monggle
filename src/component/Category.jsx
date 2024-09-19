import React, { useEffect, useState } from 'react';
import { CustomOverlayMap, Map, MapMarker } from 'react-kakao-maps-sdk';
import CategorySearch from './CategorySearch';

import SearchPagination from './SearchPagination';

const { kakao } = window;

const KEYWORD_LIST = [
  { id: 1, value: '애견카페' },
  { id: 2, value: '동물병원' },
  { id: 3, value: '애견호텔' }
];

const Category = () => {
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
  const [categoryKeyword, setCategoryKeyword] = useState('애견카페');
  const [categorypagination, setCategoryPagination] = useState(null);
  const [searchId, setSearchId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastCenter, setLastCenter] = useState(null);

  const [info, setInfo] = useState();
  const [markers, setMarkers] = useState([]);

  const [clickKeyword, setClickKeyword] = useState('');
  //민지님 코드
  /** 검색 결과 */
  const [places, setPlaces] = useState([]);

  /** 검색 키워드 */
  const [keyword, setKeyword] = useState('');

  const [pagination, setPagination] = useState({ current: 1, last: 1, gotoPage: () => {} });

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
        errMsg: 'geolocation을 사용할수 없어요..',
        isLoading: false
      }));
    }
  }, []);

  // useEffect(() => {
  //   if (!map) return;

  //   const ps = new kakao.maps.services.Places();

  //   var searchOptions = {
  //     location: coordinate,
  //     radius: 10000,
  //     sort: kakao.maps.services.SortBy.DISTANCE
  //   };

  //   const placeSearch = (data, status, pagination) => {
  //     // console.log('pagination :>> ', pagination);

  //     if (status === kakao.maps.services.Status.OK) {
  //       const bounds = new kakao.maps.LatLngBounds();
  //       let markers = [];

  //       setPlaces(data);

  //       for (var i = 0; i < data.length; i++) {
  //         markers.push({
  //           position: {
  //             lat: data[i].y,
  //             lng: data[i].x
  //           },
  //           content: data[i].place_name
  //         });

  //         bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x));
  //       }
  //       setMarkers(markers);
  //       // 검색된 장소 위치를 기준으로 지도 범위를 재설정
  //       map.setBounds(bounds);

  //       // 페이지네이션 객체 저장
  //       setPagination({
  //         current: pagination.current,
  //         last: pagination.last,
  //         gotoPage: (page) => pagination.gotoPage(page)
  //       });
  //     }
  //   };

  //   ps.keywordSearch('동물병원', placeSearch, searchOptions);
  // }, [map]);

  /** 사용자 검색 */
  const searchKeyword = () => {
    const places = new kakao.maps.services.Places();

    const placeSearch = (data, status, pagination) => {
      if (status === kakao.maps.services.Status.OK) {
        setPlaces(data);
        displayPlaces(data); // TODO 변경사항

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
          setPlaces(data);
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
          console.log('검색 실패');
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

  const moveLatLng = (data) => {
    const newLatLng = new kakao.maps.LatLng(data.y, data.x);
    map.panTo(newLatLng);
  };

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
    kakao.maps.event.addListener(map, 'click', clickListener);
    return () => {
      kakao.maps.event.removeListener(map, 'click', clickListener);
    };
  }, [map]);

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ width: '30%', height: '100vh', backgroundColor: 'orange', overflow: 'scroll' }}>
        <form onSubmit={handleSubmit}>
          <input type="text" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
          <button type="submit">검색</button>
        </form>
        <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
          {places.map((place, index) => (
            <li
              onClick={() => {
                setInfo({
                  position: {
                    lat: place.y,
                    lng: place.x
                  },
                  content: place.place_name
                });
              }}
              style={{ width: '80%', height: '5rem', backgroundColor: 'white' }}
              key={index}
            >
              <div>
                <h5>{place.place_name}</h5>
                <h5>{place.road_address_name}</h5>
                <a href={place.place_url} target="_blank">
                  홈페이지
                </a>
                <h5>{place.phone}</h5>
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
      <Map
        center={state.center}
        style={{ width: '100%', height: 'calc(100vh - 109px)', marginTop: '48px' }}
        level={3}
        onCreate={setMap}
      >
        {/* <MapMarker
          position={state.center}
          image={{
            src: 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png',
            size: {
              width: 50,
              height: 50
            }
          }}
        /> */}
        {/* {markers.map((marker) => (
          <MapMarker
            key={`marker-${marker.content}-${marker.position.lat},${marker.position.lng}`}
            position={marker.position}
            onClick={() => setInfo(marker)}
          >
            {info && info.content === marker.content && <div style={{ color: '#000' }}>{marker.content}</div>}
          </MapMarker>
        ))} */}
        <button onClick={handleReSearch}>현재 위치에서 검색</button>
        {search.map((data) => (
          <React.Fragment key={data.id}>
            <MapMarker
              key={data.id}
              position={{ lat: data.y, lng: data.x }}
              image={{
                src: 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png',
                size: {
                  width: 35,
                  height: 35
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
        {KEYWORD_LIST.map((keyword) => (
          <button
            key={keyword.id}
            onClick={() => {
              setClickKeyword(keyword.value); // TODO 변경사항
              handleKeywordSelect(keyword.value);
            }}
          >
            {keyword.value}
          </button>
        ))}
      </Map>
    </div>
  );
};

export default Category;
