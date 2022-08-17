import { Alert } from 'antd';
import { useEffect } from 'react';
import { useAlertContext } from '../../context/alertContext';
import styles from './style.module.scss';

const AppAlert = (props) => {
  const { alert, resetAlert } = useAlertContext();
  useEffect(() => {
    if (alert.message !== '') {
      resetAlert();
    }
  }, [resetAlert, alert]);
  return (
    <div className={styles.wrapper}>
      {alert.message && (
        <Alert
          {...props}
          message={alert.message}
          type={alert.type}
          closable
          onClose={() => {
            resetAlert(true);
          }}
          showIcon
          className={styles.alert}
        />
      )}
    </div>
  );
};
export default AppAlert;
