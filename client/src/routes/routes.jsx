import { Home, HomePageAdmin } from "../page/public";

export const routesGen = {
  home: "/",
//   dashboard: "/dashboard",
};
const routes = [
  {
    index: true,
    element: <Home />,
    state: "home",
  },
//   {
//     path: "/dashboard",
//     element: <HomePageAdmin />,
//     state: "dashboard",
//   },
];

export default routes