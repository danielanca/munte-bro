// TopUser.tsx
import React from "react";
import { Card, Dropdown, Table } from "react-bootstrap";
import SimpleBar from "simplebar-react";

// Images
import avatar1 from "../../../assets/images/users/avatar-1.jpg";
import avatar2 from "../../../assets/images/users/avatar-2.jpg";
import avatar4 from "../../../assets/images/users/avatar-4.jpg";
import avatar5 from "../../../assets/images/users/avatar-5.jpg";
import avatar6 from "../../../assets/images/users/avatar-6.jpg";
import avatar7 from "../../../assets/images/users/avatar-7.jpg";
import avatar8 from "../../../assets/images/users/avatar-8.jpg";

const TopUser: React.FC = () => {
  return (
    <Card>
      <Card.Body>
        <div className="float-end">
          <Dropdown align="end">
            <Dropdown.Toggle as="a" className="text-reset" id="dropdownMenuButton5">
              <span className="text-muted">
                All Members<i className="mdi mdi-chevron-down ms-1" />
              </span>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item href="#">Locations</Dropdown.Item>
              <Dropdown.Item href="#">Revenue</Dropdown.Item>
              <Dropdown.Item href="#">Join Date</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>

        <h4 className="card-title mb-4">Top Users</h4>

        <SimpleBar style={{ maxHeight: 336 }}>
          <div className="table-responsive">
            <Table className="table-borderless table-centered table-nowrap mb-0">
              <tbody>
                <tr>
                  <td style={{ width: 20 }}>
                    <img src={avatar4} className="avatar-xs rounded-circle" alt="Glenn Holden" />
                  </td>
                  <td>
                    <h6 className="font-size-15 mb-1 fw-normal">Glenn Holden</h6>
                    <p className="text-muted font-size-13 mb-0">
                      <i className="mdi mdi-map-marker" /> Nevada
                    </p>
                  </td>
                  <td>
                    <span className="badge bg-soft-danger font-size-12">Cancel</span>
                  </td>
                  <td className="text-muted fw-semibold text-end">{/* $250.00 */}</td>
                </tr>

                <tr>
                  <td>
                    <img src={avatar5} className="avatar-xs rounded-circle" alt="Lolita Hamill" />
                  </td>
                  <td>
                    <h6 className="font-size-15 mb-1 fw-normal">Lolita Hamill</h6>
                    <p className="text-muted font-size-13 mb-0">
                      <i className="mdi mdi-map-marker" /> Texas
                    </p>
                  </td>
                  <td>
                    <span className="badge bg-soft-success font-size-12">Success</span>
                  </td>
                  <td className="text-muted fw-semibold text-end">{/* $110.00 */}</td>
                </tr>

                <tr>
                  <td>
                    <img src={avatar6} className="avatar-xs rounded-circle" alt="Robert Mercer" />
                  </td>
                  <td>
                    <h6 className="font-size-15 mb-1 fw-normal">Robert Mercer</h6>
                    <p className="text-muted font-size-13 mb-0">
                      <i className="mdi mdi-map-marker" /> California
                    </p>
                  </td>
                  <td>
                    <span className="badge bg-soft-info font-size-12">Active</span>
                  </td>
                  <td className="text-muted fw-semibold text-end">{/* $420.00 */}</td>
                </tr>

                <tr>
                  <td>
                    <img src={avatar7} className="avatar-xs rounded-circle" alt="Marie Kim" />
                  </td>
                  <td>
                    <h6 className="font-size-15 mb-1 fw-normal">Marie Kim</h6>
                    <p className="text-muted font-size-13 mb-0">
                      <i className="mdi mdi-map-marker" /> Montana
                    </p>
                  </td>
                  <td>
                    <span className="badge bg-soft-warning font-size-12">Pending</span>
                  </td>
                  <td className="text-muted fw-semibold text-end">{/* $120.00 */}</td>
                </tr>

                <tr>
                  <td>
                    <img src={avatar8} className="avatar-xs rounded-circle" alt="Sonya Henshaw" />
                  </td>
                  <td>
                    <h6 className="font-size-15 mb-1 fw-normal">Sonya Henshaw</h6>
                    <p className="text-muted font-size-13 mb-0">
                      <i className="mdi mdi-map-marker" /> Colorado
                    </p>
                  </td>
                  <td>
                    <span className="badge bg-soft-info font-size-12">Active</span>
                  </td>
                  <td className="text-muted fw-semibold text-end">{/* $112.00 */}</td>
                </tr>

                <tr>
                  <td>
                    <img src={avatar2} className="avatar-xs rounded-circle" alt="Marie Kim" />
                  </td>
                  <td>
                    <h6 className="font-size-15 mb-1 fw-normal">Marie Kim</h6>
                    <p className="text-muted font-size-13 mb-0">
                      <i className="mdi mdi-map-marker" /> Australia
                    </p>
                  </td>
                  <td>
                    <span className="badge bg-soft-success font-size-12">Success</span>
                  </td>
                  <td className="text-muted fw-semibold text-end">{/* $120.00 */}</td>
                </tr>

                <tr>
                  <td>
                    <img src={avatar1} className="avatar-xs rounded-circle" alt="Sonya Henshaw" />
                  </td>
                  <td>
                    <h6 className="font-size-15 mb-1 fw-normal">Sonya Henshaw</h6>
                    <p className="text-muted font-size-13 mb-0">
                      <i className="mdi mdi-map-marker" /> India
                    </p>
                  </td>
                  <td>
                    <span className="badge bg-soft-danger font-size-12">Cancel</span>
                  </td>
                  <td className="text-muted fw-semibold text-end">{/* $112.00 */}</td>
                </tr>
              </tbody>
            </Table>
          </div>
        </SimpleBar>
      </Card.Body>
    </Card>
  );
};

export default TopUser;
