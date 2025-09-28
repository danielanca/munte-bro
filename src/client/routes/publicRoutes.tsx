import loadable from "@loadable/component";

const Mainpage = loadable(() => import("../pages/Mainpage"), { ssr: true });
const FAQBlock = loadable(() => import("../pages/FAQ/FAQBlock"), { ssr: true });
const PublicLayout = loadable(() => import("../layouts/public/PublicLayout"), { ssr: true });

const ProduseleNoastre = loadable(() => import("../components/OurProducts/ProduseleNoastre"), { ssr: true });
const ProductView = loadable(() => import("../components/Product/ProductView"), { ssr: true });
const FinishOrder = loadable(() => import("../components/CartPage/FinishOrder"), { ssr: true });
const Thankyou = loadable(() => import("../components/CartPage/OrderDone"), { ssr: true });
const Blogs = loadable(() => import("../components/mini/ConstantComponents/Blogs"), { ssr: true });
const CartPage = loadable(() => import("../components/CartPage/CartPage"), { ssr: true });
const BlogPost = loadable(() => import("../components/mini/ConstantComponents/BlogPost"), { ssr: true });
const OrderView = loadable(() => import("../components/OrderView/OrderView"), { ssr: true });
const VideoInstructions = loadable(() => import("../components/VideoInstructions/VideoInstructions"), { ssr: true });
const VideoInstructionsSupliment = loadable(
  () => import("../components/VideoInstructions/VideoInstructionsSupliment"),
  { ssr: true }
);
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
    path: "cosulmeu",
    layout: PublicLayout,
    component: CartPage,
  },
  {
    path: "intrebari",
    layout: PublicLayout,
    component: FAQBlock,
  },
  {
    path: "blogs",
    layout: PublicLayout,
    component: Blogs,
  },
  {
    path: "/blogid/:blogLink",
    layout: PublicLayout,
    component: BlogPost,
  },

  {
    path: "/factura/:orderID",
    layout: PublicLayout,
    component: OrderView,
  },

  {
    path: "/instructiuni-video",
    layout: PublicLayout,
    component: VideoInstructions,
  },

  {
    path: "/video-suplimentar",
    layout: PublicLayout,
    component: VideoInstructionsSupliment,
  },
  {
    path: "//desprenoi",
        layout: PublicLayout,

    component: Desprenoi,
  },
 
  ...TextContentRoutes,
];

export default publicRoutes;
