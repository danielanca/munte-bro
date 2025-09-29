import loadable from "@loadable/component";

const Mainpage = loadable(() => import("../pages/Mainpage"), { ssr: true });
const PublicLayout = loadable(() => import("../layouts/public/PublicLayout"), { ssr: true });

const ProduseleNoastre = loadable(() => import("../components/OurProducts/ProduseleNoastre"), { ssr: true });
const ProductView = loadable(() => import("../components/Product/ProductView"), { ssr: true });
const FinishOrder = loadable(() => import("../components/CartPage/FinishOrder1"), { ssr: true });
const Thankyou = loadable(() => import("../components/CartPage/OrderDone1"), { ssr: true });
const OrderView = loadable(() => import("../components/OrderView/OrderView"), { ssr: true });

const Desprenoi = loadable(() => import("../blocks/Desprenoi"), { ssr: true });


import { TextContentRoutes } from "./contentRoutes/contentRoutes";
import { RouteType } from "./types";



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
    path: "//desprenoi",
        layout: PublicLayout,

    component: Desprenoi,
  },
 
  ...TextContentRoutes,
];

export default publicRoutes;
