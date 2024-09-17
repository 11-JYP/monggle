import routeInstance from "../axiosInstance/base";

export const getRoute = async () => {
  const response = await routeInstance.get("/routes");
  console.log(response);
};
