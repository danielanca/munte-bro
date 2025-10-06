// MainFooter.tsx
import React from "react";
import { Container, Row, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";

type MenuItem = { title: string; to: string };

type MainFooterProps = {
  /** Whether content is contained (false = fluid). */
  contained?: boolean;
  /** Optional nav items. */
  menuItems?: MenuItem[];
  /** Copyright text. */
  copyright?: string;
};

const MainFooter: React.FC<MainFooterProps> = ({
  contained = false,
  copyright = "Copyright © MontanAir.Ro  dezvoltat de DaniAnca.Ro",
  menuItems = [
    { title: "Home", to: "#" },
    { title: "Services", to: "#" },
    { title: "About", to: "#" },
    { title: "Products", to: "#" },
    { title: "Blog", to: "#" },
  ],
}) => {
  // Container: fluid when contained=false (match original behavior)
  const fluid = !contained;

  return (
    <footer className="main-footer d-flex p-2 px-3 bg-white border-top w-100">
      <Container fluid={fluid}>
        <Row className="w-100 m-0 justify-content-between align-items-center">
          {/* Uncomment to show the menu */}
          {/*
          <Nav as="nav">
            {menuItems.map((item, idx) => (
              <Nav.Item key={idx}>
                <Nav.Link as={Link} to={item.to}>
                  {item.title}
                </Nav.Link>
              </Nav.Item>
            ))}
          </Nav>
          */}
          <p className="copyright ms-auto mb-0 text-end" style={{ textAlign: "right" }}>
            {copyright}
          </p>
        </Row>
      </Container>
    </footer>
  );
};

export default MainFooter;
