import React from "react";
import styles from "./Blogs.module.scss";
import BlogItem from "./BlogItem";
import HeadlineTitle from "../HeadLiners/HeadLiners/HeadlineTitle";
import { blogs } from "../../../data/blogStrings";
import "../../../styles/_customCSS.scss";
import HelmetHead from "../HelmetHead/HelmetHead";
import strings from "../../../data/strings.json";

const Blogs = () => {
  let { blogsArea: blogString } = strings;
  return (
    <>
      <HelmetHead title={blogString.blogTitle} description={blogString.blogSubtitle} />
      <div className={styles.blogsSection}>
        <HeadlineTitle title={blogString.blogTitle} />
        <div className={styles.blogPostsList}>
          {Object.values(blogs.posts).map(data => (
            <BlogItem data={JSON.stringify(data)} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Blogs;
