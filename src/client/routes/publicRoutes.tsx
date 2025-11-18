import loadable from "@loadable/component";

import Mainpage from "../pages/Mainpage"; 
const PublicLayout     = loadable(() => import("../layouts/public/PublicLayout"),              { ssr: true, fallback: <PageLoader/> });
const ProduseleNoastre = loadable(() => import("../components/OurProducts/ProduseleNoastre"),  { ssr: true, fallback: <PageLoader/> });
const ProductView      = loadable(() => import("../components/Product/ProductView"),           { ssr: true, fallback: <PageLoader/> });
const FinishOrder      = loadable(() => import("../components/CartPage/FinishOrder1"),         { ssr: true, fallback: <PageLoader/> });
const CartPage         = loadable(() => import("../components/CartPage/CartPage1"),            { ssr: true, fallback: <PageLoader/> });
const Thankyou         = loadable(() => import("../components/CartPage/OrderDone1"),           { ssr: true, fallback: <PageLoader/> });
const OrderView        = loadable(() => import("../components/OrderView/OrderView"),           { ssr: true, fallback: <PageLoader/> });
const Desprenoi        = loadable(() => import("../blocks/Desprenoi"),                         { ssr: true, fallback: <PageLoader/> });


import { TextContentRoutes } from "./contentRoutes/contentRoutes";
import { RouteType } from "./types";
import PageLoader from "../components/UI/PageLoader";



const clearNotification = () => {
  console.log("Notifications cleared!");
};

const publicRoutes: RouteType[] = [
  {
    path: "",
    layout: PublicLayout,
    component: Mainpage,
  },
  {
    path: "produsele-noastre",
    layout: PublicLayout,
    component: ProduseleNoastre,
  },
  {
    path: "produs/:productID",
    layout: PublicLayout,
    component: ProductView,
  },
  {
    path: "finalizare-comanda",
    layout: PublicLayout,
    component: FinishOrder,
    props: { clearNotification: clearNotification },
  },
  {
    path: "cosulmeu",
    layout: PublicLayout,
    component: CartPage,
    props: { clearNotification: clearNotification },
  },
  {
    path: "thank-you",
    layout: PublicLayout,
    component: Thankyou,
  },
 
 


  {
    path: "/factura/:orderID",
    layout: PublicLayout,
    component: OrderView,
  },




  {
    path: "/desprenoi",
        layout: PublicLayout,

    component: Desprenoi,
  },
 
  ...TextContentRoutes,
];

export default publicRoutes;
