import { Spin } from 'antd';
import { useAuthContext } from '../../context/authContext';

const PageLoader = ({ children }) => {
  const { isLoading } = useAuthContext();
  return (
    <Spin tip="Loading..." spinning={isLoading} delay={500}>
      {children}
    </Spin>
  );
};

export default PageLoader;
