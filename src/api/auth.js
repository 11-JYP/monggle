import baseInstance from "../axiosInstance/join";

export const register = async (userData) => {
  const response = await baseInstance.post("/register", userData);
  console.log(response.data);
  return response.data;
};

export const login = async (userData) => {
  const response = await baseInstance.post("/login", userData);
  console.log(response.data);
  return response.data;
};

export const getUserProfile = async (token) => {
  // console.log("token 확인 =>>", token);
  const response = await baseInstance.get("/user", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  });

  return response.data;
};
