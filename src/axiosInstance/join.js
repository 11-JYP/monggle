import axios from "axios";

const AUTH_URL = "https://moneyfulpublicpolicy.co.kr";

const baseInstance = axios.create({
  baseURL: AUTH_URL
});

export default baseInstance;
