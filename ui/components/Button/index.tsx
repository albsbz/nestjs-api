import { Button, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import styles from './style.module.scss';

const antIcon = (
  <LoadingOutlined style={{ fontSize: 24, color: 'white' }} spin />
);
const AppButton = ({ children, loading = false, ...props }) => {
  if (loading) {
    return (
      <Button
        {...{
          ...props,
          onClick: (e) => {
            e.preventDefault();
            console.log('prevent');
          },
        }}
        className={styles.button}
      >
        <div style={{ visibility: 'hidden' }}>{children}</div>
        <Spin indicator={antIcon} className={styles.spin} />
      </Button>
    );
  }
  return <Button {...props}>{children}</Button>;
};

export default AppButton;
