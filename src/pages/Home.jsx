import { Map, MapMarker } from "react-kakao-maps-sdk";
import RouteSearch from "../components/routeSearch";

const Home = () => {
  return (
    <div>
      <RouteSearch />

      <Map center={{ lat: 33.5563, lng: 126.79581 }} style={{ width: "90%", height: "100vh" }}>
        <MapMarker position={{ lat: 33.55635, lng: 126.795841 }}>
          <div style={{ color: "#000" }}>Hello World!</div>
        </MapMarker>
      </Map>
    </div>
  );
};

export default Home;
