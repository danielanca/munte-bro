import publicRoutes from "./publicRoutes";
import adminRoutes from "./adminRoutes";
// import shopRoutes from "./shopRoutes";
import { RouteType } from "./types";

const routes: RouteType[] = [
  ...publicRoutes,
  ...adminRoutes,
  // ...shopRoutes,
];

export default routes;
