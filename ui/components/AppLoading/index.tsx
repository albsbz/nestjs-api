import { Skeleton } from 'antd';
import styles from './style.module.scss';
const AppLoading = ({ children, isLoading, type = '' }) => {
  let SkeletonTyped = Skeleton;
  if (type) {
    SkeletonTyped = Skeleton[type];
  }

  return (
    <div>
      <div className={isLoading ? styles.background : styles.none}>
        <SkeletonTyped active className={styles.skeleton} />
      </div>
      <div>{children}</div>
    </div>
  );
};

export default AppLoading;
