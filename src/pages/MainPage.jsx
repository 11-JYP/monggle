import MainPageSide from "../components/MainPageSide";
import MainPageMap from "../components/MainPageMap";

const MainPage = () => {
  return (
    <div className="flex">
      <MainPageSide />
      <MainPageMap />
    </div>
  );
};

export default MainPage;
