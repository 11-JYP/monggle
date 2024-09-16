import React from "react";
import WalkPath from "../components/WalkPath";
import SaveUserRouteInfo from "../components/saveUserRouteInfo";

const WalkPathPage = () => {
  return (
    <div className="flex">
      <SaveUserRouteInfo />
      <WalkPath />
    </div>
  );
};

export default WalkPathPage;
