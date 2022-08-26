import { NextPage } from 'next';
import { ReactElement, ReactNode } from 'react';

export type TNextPageWithLayout<T> = NextPage<T> & {
  getLayout?: (page: ReactElement) => ReactNode;
};
