import React from "react";
import { Card, Dropdown } from "react-bootstrap";
import SimpleBar from "simplebar-react";

const RecentActivity: React.FC = () => {
  return (
    <Card>
      <Card.Header className="d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Recent Activity</h5>
        <Dropdown align="end">
          <Dropdown.Toggle variant="link" className="text-muted p-0">
            Recent
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item href="#">Recent</Dropdown.Item>
            <Dropdown.Item href="#">By Users</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Card.Header>
      <Card.Body>
        <SimpleBar style={{ maxHeight: 336 }}>
          <ul className="list-unstyled mb-0 ps-2">
            <li className="mb-3">
              <p className="text-muted mb-1 small">
                Today <small className="ms-1">12:20 pm</small>
              </p>
              <p className="mb-0">
                Andrei Coman magna sed porta finibus, risus posted a new article:{" "}
                <span className="text-primary">Forget UX Rowland</span>
              </p>
            </li>
            <li className="mb-3">
              <p className="text-muted mb-1 small">
                22 Jul, 2020 <small className="ms-1">12:36 pm</small>
              </p>
              <p className="mb-0">
                Andrei Coman posted a new article: <span className="text-primary">Designer Alex</span>
              </p>
            </li>
            <li className="mb-3">
              <p className="text-muted mb-1 small">
                18 Jul, 2020 <small className="ms-1">07:56 am</small>
              </p>
              <p className="mb-0">
                Zack Wetass, sed porta finibus, risus Chris Wallace Commented{" "}
                <span className="text-primary">Developer Moreno</span>
              </p>
            </li>
            <li className="mb-3">
              <p className="text-muted mb-1 small">
                10 Jul, 2020 <small className="ms-1">08:42 pm</small>
              </p>
              <p className="mb-0">
                Zack Wetass, Chris combined Commented <span className="text-primary">UX Murphy</span>
              </p>
            </li>
            <li className="mb-3">
              <p className="text-muted mb-1 small">
                23 Jun, 2020 <small className="ms-1">12:22 am</small>
              </p>
              <p className="mb-0">
                Zack Wetass, sed porta finibus, risus Chris Wallace Commented{" "}
                <span className="text-primary">Developer Moreno</span>
              </p>
            </li>
            <li>
              <p className="text-muted mb-1 small">
                20 Jun, 2020 <small className="ms-1">09:48 pm</small>
              </p>
              <p className="mb-0">
                Zack Wetass, Chris combined Commented <span className="text-primary">UX Murphy</span>
              </p>
            </li>
          </ul>
        </SimpleBar>
      </Card.Body>
    </Card>
  );
};

export default RecentActivity;
