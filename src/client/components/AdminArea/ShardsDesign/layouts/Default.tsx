import React, { PropsWithChildren } from "react";
import { Container, Row, Col } from "react-bootstrap";

import MainNavbar from "../components/layout/MainNavbar/MainNavbar";
import MainSidebar from "../components/layout/MainSidebar/MainSidebar";
import MainFooter from "../components/layout/MainFooter";

type DefaultLayoutProps = {
  /** Hide the top navbar */
  noNavbar?: boolean;
  /** Hide the footer */
  noFooter?: boolean;
};

const DefaultLayout: React.FC<PropsWithChildren<DefaultLayoutProps>> = ({
  children,
  noNavbar = false,
  noFooter = false,
}) => {
  return (
    <Container fluid>
      <Row>
        {/* Sidebar column */}
        <Col lg={2} md={3} sm={12}>
          <MainSidebar />
        </Col>

        {/* Main content column */}
        <Col
          as="main"
          className="main-content p-0"
          lg={{ span: 10 }}
          md={{ span: 9 }}
          sm={12}
        >
          {!noNavbar && <MainNavbar />}
          {children}
          {!noFooter && <MainFooter />}
        </Col>
      </Row>
    </Container>
  );
};

export default DefaultLayout;
