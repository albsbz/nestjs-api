import { Skeleton } from 'antd';
import { memo } from 'react';
import styles from './style.module.scss';
const AppLoading = ({ children, isLoading, type = '' }) => {
  let SkeletonTyped = Skeleton;
  if (type) {
    SkeletonTyped = Skeleton[type];
  }

  return (
    <div className="AppLoading">
      <div className={isLoading ? styles.background : styles.none}>
        <SkeletonTyped active className={styles.skeleton} />
      </div>
      <div className="AppLoadingChildrenWrapper">{children}</div>
    </div>
  );
};

export default memo(AppLoading);
