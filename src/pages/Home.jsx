import { Map, MapMarker } from "react-kakao-maps-sdk";

const Home = () => {
  return (
    <Map center={{ lat: 33.5563, lng: 126.79581 }} style={{ width: "600px", height: "500px", borderRadius: "20px" }}>
      <MapMarker position={{ lat: 33.55635, lng: 126.795841 }}>
        <div style={{ color: "#000" }}>Hello World!</div>
      </MapMarker>
    </Map>
  );
};

export default Home;
