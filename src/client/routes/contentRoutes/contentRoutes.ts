import loadable from "@loadable/component";
const SimpleContent = loadable(() => import("../../components/SimpleContent/SimpleContent"), { ssr: true });
const PublicLayout = loadable(() => import("../../layouts/public/PublicLayout"), { ssr: true });

import { RouteType } from "../types";

export const TextContentRoutes: RouteType[] = [
  {
    path: "termeni-si-conditii",
    layout: PublicLayout,
    component: SimpleContent,
    props: { type: "Terms" },
  },
  {
    path: "metode-plata",
    layout: PublicLayout,
    component: SimpleContent,
    props: { type: "PaymentMethods" },
  },
  {
    path: "politica-retur",
    layout: PublicLayout,
    component: SimpleContent,
    props: { type: "RefundPolicy" },
  },
  {
    path: "politica-confidentialitate",
    layout: PublicLayout,
    component: SimpleContent,
    props: { type: "PrivacyPolicy" },
  },
  {
    path: "politica-de-cookies",
    layout: PublicLayout,
    component: SimpleContent,
    props: { type: "CookiesPolicy" },
  },
  {
    path: "afiliere",
    layout: PublicLayout,
    component: SimpleContent,
    props: { type: "AffiliateProgram" },
  },
  {
    path: "contact",
    layout: PublicLayout,
    component: SimpleContent,
    props: { type: "ContactSimple" },
  },
];
