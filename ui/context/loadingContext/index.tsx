import { createContext, useContext, useMemo, useState } from 'react';
import { ILoaingContext } from '../../common/interface/ILoadingContext';
import { IProps } from '../../common/interface/IProps';

const context: ILoaingContext = {
  isLoading: true,
  setIsLoading: (v: boolean) => {},
};

export const AuthContext = createContext(context);

export const useLoadingContext = () => {
  return useContext(AuthContext);
};

export const LoadingContextProvider: React.FC<IProps> = (props) => {
  const [isLoading, setIsLoading] = useState(true);
  const store = useMemo(
    () => ({ isLoading, setIsLoading }),
    [isLoading, setIsLoading],
  );

  return <AuthContext.Provider value={store} {...props} />;
};
