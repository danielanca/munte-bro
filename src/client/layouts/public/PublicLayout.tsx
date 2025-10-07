// PublicLayout.tsx
/* eslint-disable react/react-in-jsx-scope */
// import loadable from "@loadable/component";

// ⬇️ use static imports for now (no lazy, no loadable)
import Footer from "../../components/Footer/FooterMontanNew";
import Navbar from "../../components/Navbar/NavbarNew";

type Lay = {
  children: React.ReactNode;
  noNavbar?: boolean;
  noFooter?: boolean;
  clearNotif?: number | null;
};

const PublicLayout = ({ children, noNavbar, noFooter, clearNotif }: Lay) => (
  <>
    {!noNavbar && <Navbar clearNotif={Number(clearNotif ?? 0)} />}
    {children}
    {!noFooter && <Footer />}
  </>
);

export default PublicLayout;
