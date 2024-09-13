import axios from "axios";

const ROUTE_URL = "http://localhost:4000";

const routeInstance = axios.create({
  baseURL: ROUTE_URL
});

export default routeInstance;
