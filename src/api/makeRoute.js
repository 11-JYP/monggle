import axios from "axios";

const API_URL = "http://localhost:4000/Route";

export const getRoute = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const createRoute = async (resultRoute) => {
  const response = await axios.post(API_URL, resultRoute);
  return response;
};
