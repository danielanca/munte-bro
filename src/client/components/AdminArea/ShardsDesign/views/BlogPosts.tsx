// src/client/components/AdminArea/ShardsDesign/views/BlogPosts.tsx
import React from "react";
import { Container, Row, Col, Card, Badge, Button } from "react-bootstrap";
import PageTitle from "../components/common/PageTitle";

type Post1 = {
  backgroundImage: string;
  category: string;
  categoryTheme: string;
  author: string;
  authorAvatar: string;
  title: string;
  body: string;
  date: string;
};

type Post2 = {
  backgroundImage: string;
  category: string;
  categoryTheme: string;
  author: string;
  authorAvatar: string;
  title: string;
  body: string;
  date: string;
};

type Post3 = {
  author: string;
  authorAvatar: string;
  title: string;
  body: string;
  date: string;
};

type Post4 = {
  backgroundImage: string;
  author: string;
  authorUrl: string;
  category: string;
  categoryUrl: string;
  title: string;
  body: string;
  date: string;
};

const img = (p: string) => new URL(p, import.meta.url).toString();

const BlogPosts: React.FC = () => {
  const PostsListOne: Post1[] = [
    {
      backgroundImage: img("../images/content-management/1.jpeg"),
      category: "Business",
      categoryTheme: "dark",
      author: "Anna Kunis",
      authorAvatar: img("../images/avatars/1.jpg"),
      title: "Conduct at an replied removal an amongst",
      body: "However venture pursuit he am mr cordial. Forming musical am hearing studied be luckily. But in for determine what would see...",
      date: "28 February 2019",
    },
    {
      backgroundImage: img("../images/content-management/2.jpeg"),
      category: "Travel",
      categoryTheme: "info",
      author: "James Jamerson",
      authorAvatar: img("../images/avatars/2.jpg"),
      title: "Off tears are day blind smile alone had ready",
      body: "Is at purse tried jokes china ready decay an. Small its shy way had woody downs power. To denoting admitted speaking learning my...",
      date: "29 February 2019",
    },
    {
      backgroundImage: img("../images/content-management/3.jpeg"),
      category: "Technology",
      categoryTheme: "primary",
      author: "Jimmy Jackson",
      authorAvatar: img("../images/avatars/2.jpg"),
      title: "Difficult in delivered extensive at direction",
      body: "Is at purse tried jokes china ready decay an. Small its shy way had woody downs power. To denoting admitted speaking learning my...",
      date: "29 February 2019",
    },
    {
      backgroundImage: img("../images/content-management/4.jpeg"),
      category: "Business",
      categoryTheme: "warning",
      author: "John James",
      authorAvatar: img("../images/avatars/3.jpg"),
      title: "It so numerous if he may outlived disposal",
      body: "How but sons mrs lady when. Her especially are unpleasant out alteration continuing unreserved ready road market resolution...",
      date: "29 February 2019",
    },
  ];

  const PostsListTwo: Post2[] = [
    {
      backgroundImage: img("../images/content-management/5.jpeg"),
      category: "Travel",
      categoryTheme: "info",
      author: "Anna Ken",
      authorAvatar: img("../images/avatars/0.jpg"),
      title: "Attention he extremity unwilling on otherwise cars backwards yet",
      body: "Conviction up partiality as delightful is discovered. Yet jennings resolved disposed exertion you off. Left did fond drew fat head poor jet pan flying over...",
      date: "29 February 2019",
    },
    {
      backgroundImage: img("../images/content-management/6.jpeg"),
      category: "Business",
      categoryTheme: "dark",
      author: "John James",
      authorAvatar: img("../images/avatars/1.jpg"),
      title: "Totally words widow one downs few age every seven if miss part by fact",
      body: "Discovered had get considered projection who favourable. Necessary up knowledge it tolerably. Unwilling departure education to admitted speaking...",
      date: "29 February 2019",
    },
  ];

  const PostsListThree: Post3[] = [
    {
      author: "John James",
      authorAvatar: img("../images/avatars/1.jpg"),
      title: "Had denoting properly jointure which well books beyond",
      body: "In said to of poor full be post face snug. Introduced imprudence see say unpleasing devonshire acceptance son. Exeter longer wisdom work...",
      date: "29 February 2019",
    },
    {
      author: "John James",
      authorAvatar: img("../images/avatars/2.jpg"),
      title: "Husbands ask repeated resolved but laughter debating",
      body: "It abode words began enjoy years no do ﻿no. Tried spoil as heart visit blush or. Boy possible blessing sensible set but margaret interest. Off tears...",
      date: "29 February 2019",
    },
    {
      author: "John James",
      authorAvatar: img("../images/avatars/3.jpg"),
      title: "Instantly gentleman contained belonging exquisite now direction",
      body: "West room at sent if year. Numerous indulged distance old law you. Total state as merit court green decay he. Steepest merit checking railway...",
      date: "29 February 2019",
    },
  ];

  const PostsListFour: Post4[] = [
    {
      backgroundImage: img("../images/content-management/7.jpeg"),
      author: "Alene Trenton",
      authorUrl: "#",
      category: "News",
      categoryUrl: "#",
      title: "Extremity so attending objection as engrossed",
      body: "Pursuit chamber as elderly amongst on. Distant however warrant farther to of. My justice wishing prudent waiting in be...",
      date: "29 February 2019",
    },
    {
      backgroundImage: img("../images/content-management/8.jpeg"),
      author: "Chris Jamie",
      authorUrl: "#",
      category: "News",
      categoryUrl: "#",
      title: "Bed sincerity yet therefore forfeited his",
      body: "Speaking throwing breeding betrayed children my to. Me marianne no he horrible produced ye. Sufficient unpleasing and...",
      date: "29 February 2019",
    },
    {
      backgroundImage: img("../images/content-management/9.jpeg"),
      author: "Monica Jordan",
      authorUrl: "#",
      category: "News",
      categoryUrl: "#",
      title: "Object remark lively all did feebly excuse our",
      body: "Morning prudent removal an letters by. On could my in order never it. Or excited certain sixteen it to parties colonel not seeing...",
      date: "29 February 2019",
    },
    {
      backgroundImage: img("../images/content-management/10.jpeg"),
      author: "Monica Jordan",
      authorUrl: "#",
      category: "News",
      categoryUrl: "#",
      title: "His followed carriage proposal entrance",
      body: "For county now sister engage had season better had waited. Occasional mrs interested far expression directly as regard...",
      date: "29 February 2019",
    },
  ];

  return (
    <Container fluid className="main-content-container px-4">
      <Row className="page-header py-4 g-0">
        <Col>
          <PageTitle title="Blog Posts" subtitle="Components" className="text-sm-left" />
        </Col>
      </Row>

      <Row>
        {PostsListOne.map((post, idx) => (
          <Col lg={3} md={6} sm={12} className="mb-4" key={idx}>
            <Card className="card-post card-post--1 h-100">
              <div
                className="card-post__image"
                style={{ backgroundImage: `url(${post.backgroundImage})` }}
              >
                <Badge pill bg={post.categoryTheme} className="card-post__category">
                  {post.category}
                </Badge>
                <div className="card-post__author d-flex">
                  <a
                    href="#"
                    className="card-post__author-avatar card-post__author-avatar--small"
                    style={{ backgroundImage: `url('${post.authorAvatar}')` }}
                  >
                    Written by {post.author}
                  </a>
                </div>
              </div>
              <Card.Body>
                <h5 className="card-title">
                  <a href="#" className="text-fiord-blue">
                    {post.title}
                  </a>
                </h5>
                <p className="card-text d-inline-block mb-3">{post.body}</p>
                <span className="text-muted">{post.date}</span>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Row>
        {PostsListTwo.map((post, idx) => (
          <Col lg={6} sm={12} className="mb-4" key={idx}>
            <Card className="card-post card-post--aside card-post--1 h-100">
              <div
                className="card-post__image"
                style={{ backgroundImage: `url('${post.backgroundImage}')` }}
              >
                <Badge pill bg={post.categoryTheme} className="card-post__category">
                  {post.category}
                </Badge>
                <div className="card-post__author d-flex">
                  <a
                    href="#"
                    className="card-post__author-avatar card-post__author-avatar--small"
                    style={{ backgroundImage: `url('${post.authorAvatar}')` }}
                  >
                    Written by Anna Ken
                  </a>
                </div>
              </div>
              <Card.Body>
                <h5 className="card-title">
                  <a className="text-fiord-blue" href="#">
                    {post.title}
                  </a>
                </h5>
                <p className="card-text d-inline-block mb-3">{post.body}</p>
                <span className="text-muted">{post.date}</span>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Row>
        {PostsListThree.map((post, idx) => (
          <Col lg={4} key={idx}>
            <Card className="card-post mb-4 h-100">
              <Card.Body>
                <h5 className="card-title">{post.title}</h5>
                <p className="card-text text-muted">{post.body}</p>
              </Card.Body>
              <Card.Footer className="border-top d-flex">
                <div className="card-post__author d-flex">
                  <a
                    href="#"
                    className="card-post__author-avatar card-post__author-avatar--small"
                    style={{ backgroundImage: `url('${post.authorAvatar}')` }}
                  >
                    Written by James Khan
                  </a>
                  <div className="d-flex flex-column justify-content-center ms-3">
                    <span className="card-post__author-name">{post.author}</span>
                    <small className="text-muted">{post.date}</small>
                  </div>
                </div>
                <div className="my-auto ms-auto">
                  <Button size="sm" variant="light">
                    <i className="far fa-bookmark me-1" /> Bookmark
                  </Button>
                </div>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>

      <Row>
        {PostsListFour.map((post, idx) => (
          <Col lg={3} md={6} sm={12} className="mb-4" key={idx}>
            <Card className="card-post h-100">
              <div
                className="card-post__image"
                style={{ backgroundImage: `url('${post.backgroundImage}')` }}
              />
              <Card.Body>
                <h5 className="card-title">
                  <a className="text-fiord-blue" href="#">
                    {post.title}
                  </a>
                </h5>
                <p className="card-text">{post.body}</p>
              </Card.Body>
              <Card.Footer className="text-muted border-top py-3">
                <span className="d-inline-block">
                  By{" "}
                  <a className="text-fiord-blue" href={post.authorUrl}>
                    {post.author}
                  </a>{" "}
                  in{" "}
                  <a className="text-fiord-blue" href={post.categoryUrl}>
                    {post.category}
                  </a>
                </span>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default BlogPosts;
