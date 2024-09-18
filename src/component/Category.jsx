import React, { useEffect, useState } from 'react';
import { CustomOverlayMap, Map, MapMarker } from 'react-kakao-maps-sdk';
import CategorySearch from './CategorySearch';

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
  const [keyword, setKeyword] = useState('애견카페');
  const [pagination, setPagination] = useState(null);
  const [searchId, setSearchId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastCenter, setLastCenter] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setState((prev) => ({
            ...prev,
            center: {
              lat: position.coords.latitude,
              lng: position.coords.longitude
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
      setState((prev) => ({
        ...prev,
        errMsg: 'geolocation을 사용할수 없어요..',
        isLoading: false
      }));
    }
  }, []);

  const searchPlaces = (center, page) => {
    if (!state.center) return;
    const ps = new kakao.maps.services.Places();

    const options = {
      location: new kakao.maps.LatLng(center.lat, center.lng),
      radius: 5000,
      sort: kakao.maps.services.SortBy.DISTANCE,
      page
    };

    ps.keywordSearch(
      keyword,
      (data, status, pagination) => {
        if (status === kakao.maps.services.Status.OK) {
          displayPlaces(data);
          const bounds = new kakao.maps.LatLngBounds();
          data.forEach((item) => bounds.extend(new kakao.maps.LatLng(item.y, item.x)));
          map.setBounds(bounds);
          setPagination(pagination);
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

  const handleKeywordSelect = (selectedKeyword) => {
    setKeyword(selectedKeyword);
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
  }, [map, keyword, currentPage]);

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
    <Map
      center={state.center}
      style={{ width: '100%', height: 'calc(100vh - 109px)', marginTop: '48px' }}
      level={3}
      onCreate={setMap}
    >
      <MapMarker
        position={state.center}
        image={{
          src: 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png',
          size: {
            width: 50,
            height: 50
          }
        }}
      />
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
        <button key={keyword.id} onClick={() => handleKeywordSelect(keyword.value)}>
          {keyword.value}
        </button>
      ))}
    </Map>
  );
};

export default Category;
