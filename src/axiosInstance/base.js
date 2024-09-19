import axios from "axios";

const ROUTE_URL = "http://localhost:4000";

const routeInstance = axios.create({
  baseURL: ROUTE_URL
});

export default routeInstance;

// ** 하영 - db.json 목데이터로 작업할 때 쓴 것
// 최종확인 후 불필요 시 삭제 가능
