import React from "react";
import { Card, Button, ListGroup, ProgressBar } from "react-bootstrap";

// If you import the avatar file, prefer:
// import avatar0 from "./../../images/avatars/0.jpg";

export type UserDetailsData = {
  name: string;
  avatar: string; // URL/path to image
  jobTitle: string;
  performanceReportTitle: string;
  performanceReportValue: number; // 0–100
  metaTitle: string;
  metaValue: string;
};

export type UserDetailsProps = {
  /** The user details object. */
  userDetails?: UserDetailsData;
  /** Optional click handler for the Follow button. */
  onFollow?: () => void;
};

const DEFAULT_DETAILS: UserDetailsData = {
  name: "Sierra Brooks",
  // If your bundler supports svg/jpg imports, replace with an import; otherwise keep require + .default:
  avatar: (require("../../images/avatars/0.jpg").default ?? require("../../images/avatars/0.jpg")) as string,
  jobTitle: "Project Manager",
  performanceReportTitle: "Workload",
  performanceReportValue: 74,
  metaTitle: "Description",
  metaValue:
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio eaque, quidem, commodi soluta qui quae minima obcaecati quod dolorum sint alias, possimus illum assumenda eligendi cumque?",
};

const UserDetails: React.FC<UserDetailsProps> = ({
  userDetails = DEFAULT_DETAILS,
  onFollow,
}) => {
  const {
    name,
    avatar,
    jobTitle,
    performanceReportTitle,
    performanceReportValue,
    metaTitle,
    metaValue,
  } = userDetails;

  return (
    <Card className="mb-4 pt-3">
      <Card.Header className="border-bottom text-center">
        <div className="mb-3 mx-auto">
          <img
            className="rounded-circle"
            src={avatar}
            alt={name}
            width={110}
            height={110}
            style={{ objectFit: "cover" }}
          />
        </div>

        <h4 className="mb-0">{name}</h4>
        <span className="text-muted d-block mb-2">{jobTitle}</span>

        <Button
          variant="outline-primary"
          size="sm"
          className="mb-2 rounded-pill"
          onClick={onFollow}
        >
          <i className="material-icons mx-1">person_add</i> Follow
        </Button>
      </Card.Header>

      <ListGroup variant="flush">
        <ListGroup.Item className="px-4">
          <div className="progress-wrapper">
            <strong className="text-muted d-block mb-2">
              {performanceReportTitle}
            </strong>
            <ProgressBar
              now={performanceReportValue}
              label={`${performanceReportValue}%`}
              className="progress-sm"
            />
          </div>
        </ListGroup.Item>

        <ListGroup.Item className="p-4">
          <strong className="text-muted d-block mb-2">{metaTitle}</strong>
          <span>{metaValue}</span>
        </ListGroup.Item>
      </ListGroup>
    </Card>
  );
};

export default UserDetails;
