import { Alert } from 'antd';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { IProps } from '../../common/interface/IProps';

type AlertTypes = 'success' | 'info' | 'warning' | 'error';
type AlertObjectType = {
  message: string;
  type?: AlertTypes;
  hide?: boolean;
};

export const AlertContext = createContext({
  alert: { message: '', type: 'info' } as AlertObjectType,
  setAlert: ({ message, type }: AlertObjectType) => {},
  resetAlert: (noTimeout?: boolean | undefined) => {},
});

export const useAlertContext = () => {
  return useContext(AlertContext);
};

export const AlertContextProvider: React.FC<IProps> = (props) => {
  const [alert, setAlert] = useState({
    message: '',
    type: 'info',
  } as AlertObjectType);

  useEffect(() => {
    let timer;
    if (alert.message !== '' && alert.hide) {
      timer = setTimeout(() => {
        setAlert({ message: '', type: 'info' });
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [alert]);

  const store = useMemo(() => {
    const resetAlert = (noTimeout: boolean | undefined) => {
      if (alert.message !== '') {
        if (noTimeout) {
          setAlert({ message: '', type: 'info' });
          return;
        }

        let timer;
        if (alert.message !== '') {
          timer = setTimeout(() => {
            setAlert({ message: '', type: 'info' });
            clearTimeout(timer);
          }, 3000);
        }
      }
    };
    return { alert, setAlert, resetAlert };
  }, [alert, setAlert]);

  return <AlertContext.Provider value={store} {...props} />;
};
