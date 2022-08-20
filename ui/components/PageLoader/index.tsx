import { Spin } from 'antd';
import { useAuthContext } from '../../context/authContext';
import styles from './style.module.scss';

const PageLoader = ({ children, needAuth }) => {
  const { isLoading } = useAuthContext();

  const RenderChildren = (!needAuth || (!isLoading && needAuth)) && (
    <div>{children}</div>
  );

  return (
    <Spin
      tip="Loading..."
      spinning={isLoading}
      delay={500}
      wrapperClassName={styles.spinWrapper}
    >
      {RenderChildren}
    </Spin>
  );
};

export default PageLoader;
