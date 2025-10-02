// src/client/components/AdminArea/ShardsDesign/views/AddNewPost.tsx
import React from "react";
import { Container, Row, Col } from "react-bootstrap";

import PageTitle from "../components/common/PageTitle";
import Editor from "../components/add-new-post/Editor";
import SidebarActions from "../components/add-new-post/SidebarActions";
import SidebarCategories from "../components/add-new-post/SidebarCategories";

const AddNewPost: React.FC = () => (
  <Container fluid className="main-content-container px-4 pb-4">
    <Row className="page-header py-4 g-0">
      <Col>
        <PageTitle sm="4" title="Add New Post" subtitle="Blog Posts" className="text-sm-left" />
      </Col>
    </Row>

    <Row>
      <Col lg={9} md={12}>
        <Editor />
      </Col>

      <Col lg={3} md={12}>
        <SidebarActions />
        <SidebarCategories />
      </Col>
    </Row>
  </Container>
);

export default AddNewPost;
