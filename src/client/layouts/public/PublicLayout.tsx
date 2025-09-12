/* eslint-disable react/react-in-jsx-scope */
import loadable from "@loadable/component";

const Footer = loadable(() => import("../../components/Footer/Footer"), { ssr: true });
const Navbar = loadable(() => import("../../components/Navbar/Navbar"), { ssr: true });

interface Lay {
  children: any | null;
  noNavbar: any | null;
  noFooter: any | null;
  clearNotif: any | null;
}
const PublicLayout = ({ children, noNavbar, noFooter, clearNotif }: Lay) => (
  <>
    {!noNavbar && <Navbar clearNotif={clearNotif} />}
    {children}
    {!noFooter && <Footer />}
  </>
);

export default PublicLayout;
