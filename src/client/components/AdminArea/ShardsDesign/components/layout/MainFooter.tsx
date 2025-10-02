import React from "react";
import { Container, Row, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";

export type FooterMenuItem = {
  title: string;
  to: string;
};

export type MainFooterProps = {
  /** When true, container is fluid (full width). Mirrors previous `fluid={contained}`. */
  contained?: boolean;
  /** Optional nav items (pass [] to hide). */
  menuItems?: FooterMenuItem[];
  /** Copyright text. */
  copyright?: string;
  className?: string;
};

const DEFAULT_MENU: FooterMenuItem[] = [
  { title: "Home", to: "#" },
  { title: "Services", to: "#" },
  { title: "About", to: "#" },
  { title: "Products", to: "#" },
  { title: "Blog", to: "#" },
];

const MainFooter: React.FC<MainFooterProps> = ({
  contained = false,
  menuItems = DEFAULT_MENU,
  copyright = "Copyright © MontanAir.Ro  dezvoltat de DaniAnca.Ro",
  className,
}) => {
  return (
    <footer className={`main-footer d-flex p-2 px-3 bg-white border-top ${className ?? ""}`}>
      {/* Note: react-bootstrap uses `fluid` to mean full-width. */}
      <Container fluid={contained}>
        <Row className="w-100 align-items-center">
          {menuItems.length > 0 && (
            <Nav className="flex-row">
              {menuItems.map((item, idx) => (
                <Nav.Item key={idx} className="me-3">
                  <Nav.Link as={Link} to={item.to}>
                    {item.title}
                  </Nav.Link>
                </Nav.Item>
              ))}
            </Nav>
          )}

          <p className="ms-auto mb-0 text-end copyright" style={{ textAlign: "right" }}>
            {copyright}
          </p>
        </Row>
      </Container>
    </footer>
  );
};

export default MainFooter;
