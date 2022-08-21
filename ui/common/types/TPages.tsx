import { NextPage } from 'next';
import { ComponentType, ReactElement, ReactNode } from 'react';

export type TPage<P = {}> = NextPage<P> & {
  getLayout?: (page: ReactElement) => ReactNode;
  layout?: ComponentType;
};
