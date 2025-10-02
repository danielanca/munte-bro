// src/client/components/AdminArea/ShardsDesign/views/ComponentsOverview.tsx
import React from "react";
import { Container, Row, Col, Card, ListGroup, Alert, Form } from "react-bootstrap";

import PageTitle from "../components/common/PageTitle";
import Colors from "../components/components-overview/Colors";
import Checkboxes from "../components/components-overview/Checkboxes";
import RadioButtons from "../components/components-overview/RadioButtons";
import ToggleButtons from "../components/components-overview/ToggleButtons";
import SmallButtons from "../components/components-overview/SmallButtons";
import SmallOutlineButtons from "../components/components-overview/SmallOutlineButtons";
import NormalButtons from "../components/components-overview/NormalButtons";
import NormalOutlineButtons from "../components/components-overview/NormalOutlineButtons";
import Forms from "../components/components-overview/Forms";
import FormValidation from "../components/components-overview/FormValidation";
import CompleteFormExample from "../components/components-overview/CompleteFormExample";
import Sliders from "../components/components-overview/Sliders";
import ProgressBars from "../components/components-overview/ProgressBars";
import ButtonGroups from "../components/components-overview/ButtonGroups";
import InputGroups from "../components/components-overview/InputGroups";
import SeamlessInputGroups from "../components/components-overview/SeamlessInputGroups";
import CustomFileUpload from "../components/components-overview/CustomFileUpload";
import DropdownInputGroups from "../components/components-overview/DropdownInputGroups";
import CustomSelect from "../components/components-overview/CustomSelect";

const ComponentsOverview: React.FC = () => (
  <div>
    <Container fluid className="px-0">
      <Alert variant="danger" className="mb-0">
        <i className="fa fa-laptop mx-2" /> How you doin'? I'm just a friendly, good-looking notification message and I
        come in all the colors you can see below. Pretty cool, huh?
      </Alert>
    </Container>

    <Container fluid className="main-content-container px-4">
      <Row className="page-header py-4 g-0">
        <Col>
          <PageTitle sm="4" title="Forms & Components" subtitle="Overview" className="text-sm-left" />
        </Col>
      </Row>

      <Colors />

      <Row>
        <Col lg={8} className="mb-4">
          <Card className="mb-4">
            <Card.Header className="border-bottom">
              <h6 className="m-0">Form Inputs</h6>
            </Card.Header>

            <ListGroup variant="flush">
              <ListGroup.Item className="p-0 px-3 pt-3">
                <Row>
                  <Checkboxes />
                  <RadioButtons />
                  <ToggleButtons />
                </Row>
              </ListGroup.Item>

              <ListGroup.Item className="p-3">
                <strong className="text-muted d-block my-2">Small Buttons</strong>
                <SmallButtons />
                <strong className="text-muted d-block my-2">Small Outline Button</strong>
                <SmallOutlineButtons />
              </ListGroup.Item>

              <ListGroup.Item className="p-3">
                <strong className="text-muted d-block my-2">Normal Buttons</strong>
                <NormalButtons />
                <strong className="text-muted d-block my-2">Normal Outline Buttons</strong>
                <NormalOutlineButtons />
              </ListGroup.Item>

              <ListGroup.Item className="p-3">
                <Row>
                  <Forms />
                  <FormValidation />
                </Row>
              </ListGroup.Item>
            </ListGroup>
          </Card>

          <Card>
            <Card.Header className="border-bottom">
              <h6 className="m-0">Form Example</h6>
            </Card.Header>
            <CompleteFormExample />
          </Card>
        </Col>

        <Col lg={4} className="mb-4">
          <Card className="mb-4">
            <Card.Header className="border-bottom">
              <h6 className="m-0">Sliders & Progress Bars</h6>
            </Card.Header>
            <ListGroup variant="flush">
              <ListGroup.Item className="p-0">
                <ProgressBars />
              </ListGroup.Item>
              <ListGroup.Item className="p-0">
                <Sliders />
              </ListGroup.Item>
            </ListGroup>
          </Card>

          <Card className="mb-4">
            <Card.Header className="border-bottom">
              <h6 className="m-0">Groups</h6>
            </Card.Header>

            <ListGroup variant="flush">
              <ListGroup.Item className="px-3">
                <Form>
                  <strong className="text-muted d-block mb-3">Button Groups</strong>
                  <ButtonGroups />
                  <strong className="text-muted d-block mb-2">Input Groups</strong>
                  <InputGroups />
                  <strong className="text-muted d-block mb-2">Seamless Input Groups</strong>
                  <SeamlessInputGroups />
                </Form>
              </ListGroup.Item>
            </ListGroup>
          </Card>

          <Card>
            <Card.Header className="border-bottom">
              <h6 className="m-0">Files & Dropdowns</h6>
            </Card.Header>

            <ListGroup variant="flush">
              <ListGroup.Item className="px-3">
                <strong className="text-muted d-block mb-2">Custom File Upload</strong>
                <CustomFileUpload />
                <strong className="text-muted d-block mb-2">Dropdown Input Groups</strong>
                <DropdownInputGroups />
                <strong className="text-muted d-block mb-2">Custom Select</strong>
                <CustomSelect />
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </Container>
  </div>
);

export default ComponentsOverview;
