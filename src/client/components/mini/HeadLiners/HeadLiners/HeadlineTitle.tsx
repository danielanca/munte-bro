import styles from '../HeadLiners/HeadlineTitle.module.scss';

interface IProps {
  title: string;
}

const HeadlineTitle = ({ title }: IProps) => {
  return (
    <div className={styles.banner + ' d-flex justify-content-center align-items-center'}>
      <h3 className={styles.titleBanner}>{title}</h3>
    </div>
  );
};

export default HeadlineTitle;
