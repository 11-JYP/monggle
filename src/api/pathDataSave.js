import axios from "axios";

const PATH_ROUTE_API_URL = "https://best-fresh-mojoceratops.glitch.me/Route";
export const getRouteInfo = async () => {
  const response = await axios.get(PATH_ROUTE_API_URL);
  return response.data;
};

export const createRouteInfo = async (routeInfoData) => {
  await axios.post(PATH_ROUTE_API_URL, routeInfoData);
};
