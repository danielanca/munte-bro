import React from "react";
import { NavHashLink } from "react-router-hash-link";
import { blogs } from "../../data/blogStrings";
import styles from "./../../components/ConstantComponents/BlogItem.module.scss";
import strings from "../../data/strings.json";
import "./../../data/customCSS.scss";
interface BlogProps {
  data: string;
}
interface BlogItemsProps {
  title: string;
  firstDescription: string;
  jsonContent: string;
  link: string;
  image: string;
}

const BlogItem = ({ data }: BlogProps) => {
  let { blogsArea: blogStr } = strings;
  let blogData: BlogItemsProps = JSON.parse(data);
  console.log("BLOG ITEM:", blogData.link);
  console.log("BLOG image:", blogs.posts[blogData.link].image);

  const gotoElement = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className={styles.blogItem + " my-5 "}>
      <NavHashLink
        onClick={gotoElement}
        className={styles.HashLinkStyle}
        to={`/${blogStr.blogURLSuffix}/` + blogData.link}
      >
        <div className={styles.topPart}>
          <div className={styles.floaterThumbnail}>
            <div className={styles.thumbnailWrapper}>
              <img alt={blogData.link} className={styles.thumbnailImage} src={blogs.posts[blogData.link].image} />
            </div>
          </div>
        </div>
        <div className={styles.bottomPart}>
          <div className={styles.highlighter}>
            <h3 className={styles.labelCategory}>{"GANDURI"}</h3>
          </div>
          <div className={styles.titleArea}>
            <h3 className={styles.titlePost}>{blogData.title}</h3>
          </div>
          <div className={styles.previewPost}>
            <p className={styles.excerptText}>{blogData.firstDescription}</p>
            <span className={styles.readMore}>{blogStr.blogsInner.readArticle}</span>
          </div>
        </div>
      </NavHashLink>
    </div>
  );
};

export default BlogItem;
