// Discussions.tsx
import React from "react";
import { Card, ButtonGroup, Button, Row, Col } from "react-bootstrap";

type DiscussionAuthor = {
  image: string;
  name: string;
  url: string;
};

type DiscussionPost = {
  title: string;
  url: string;
};

type Discussion = {
  id: number;
  date: string;
  author: DiscussionAuthor;
  post: DiscussionPost;
  body: string;
};

type DiscussionsProps = {
  title?: string;
  discussions?: Discussion[];
};

const Discussions: React.FC<DiscussionsProps> = ({
  title = "Reviews",
  discussions = [
    {
      id: 1,
      date: "3 days ago",
      author: {
        // Adjust paths to your bundler/assets setup
        image: "/images/avatars/1.jpg",
        name: "John Doe",
        url: "#",
      },
      post: { title: "Hello World!", url: "#" },
      body: "Well, the way they make shows is, they make one show ...",
    },
    {
      id: 2,
      date: "4 days ago",
      author: {
        image: "/images/avatars/2.jpg",
        name: "John Doe",
        url: "#",
      },
      post: { title: "Hello World!", url: "#" },
      body: "After the avalanche, it took us a week to climb out. Now...",
    },
    {
      id: 3,
      date: "5 days ago",
      author: {
        image: "/images/avatars/3.jpg",
        name: "John Doe",
        url: "#",
      },
      post: { title: "Hello World!", url: "#" },
      body: "My money's in that office, right? If she start giving me...",
    },
  ],
}) => (
  <Card className="blog-comments">
    <Card.Header className="border-bottom">
      <h6 className="m-0">{title}</h6>
    </Card.Header>

    <Card.Body className="p-0">
      {discussions.map((discussion, idx) => (
        <div key={discussion.id ?? idx} className="blog-comments__item d-flex p-3">
          {/* Avatar */}
          <div className="blog-comments__avatar mr-3">
            <img src={discussion.author.image} alt={discussion.author.name} />
          </div>

          {/* Content */}
          <div className="blog-comments__content px-3">
            {/* Content :: Title */}
            <div className="blog-comments__meta text-mutes">
              <a className="text-secondary" href={discussion.author.url}>
                {discussion.author.name}
              </a>
              {` on `}
              <a className="text-secondary" href={discussion.post.url}>
                {discussion.post.title}
              </a>
              <span className="text-mutes">- {discussion.date}</span>
            </div>

            {/* Content :: Body */}
            <p className="m-0 my-1 mb-2 text-muted">{discussion.body}</p>

            {/* Content :: Actions */}
            <div className="blog-comments__actions">
              <ButtonGroup size="sm">
                <Button variant="light">
                  <span className="text-success">
                    <i className="material-icons">check</i>
                  </span>
                  {` Approve `}
                </Button>
                <Button variant="light">
                  <span className="text-danger">
                    <i className="material-icons">clear</i>
                  </span>
                  {` Reject`}
                </Button>
                <Button variant="light">
                  <span className="text-light">
                    <i className="material-icons">more_vert</i>
                  </span>
                  {` Edit `}
                </Button>
              </ButtonGroup>
            </div>
          </div>
        </div>
      ))}
    </Card.Body>

    <Card.Footer className="border-top">
      <Row>
        <Col className="text-center view-report">
          <Button variant="light" type="button">
            View All Comments
          </Button>
        </Col>
      </Row>
    </Card.Footer>
  </Card>
);

export default Discussions;
