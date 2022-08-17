import { Alert } from 'antd';
import { createContext, useContext, useEffect, useState } from 'react';
import { Props } from '../../common/interface/Props';

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

export const AlertContextProvider: React.FC<Props> = (props) => {
  const [alert, setAlert] = useState({
    message: '',
    type: 'info',
  } as AlertObjectType);

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

  useEffect(() => {
    let timer;
    if (alert.message !== '' && alert.hide) {
      timer = setTimeout(() => {
        setAlert({ message: '', type: 'info' });
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [alert]);

  return (
    <AlertContext.Provider value={{ alert, setAlert, resetAlert }} {...props} />
  );
};
