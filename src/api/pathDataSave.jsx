import axios from 'axios';

const PATH_ROUTE_API_URL = 'http://localhost:4005/Route';

export const getRouteInfo = async () => {
  const response = await axios.get(PATH_ROUTE_API_URL);
  return response.data;
};

export const createRouteInfo = async (routeInfoData) => {
  await axios.post(PATH_ROUTE_API_URL, routeInfoData);
};

// export const deleteRouteInfo = async (id) => {
//   axios.delete(`PATH_ROUTE_API_URL/${id}`);
// };

// export const updateRouteInfo = async (id, visibility) => {
//   axios.patch(`PATH_ROUTE_API_URL/${id}`, { visibility });
// };
