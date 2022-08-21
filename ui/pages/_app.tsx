import { AppProps } from 'next/app';
import { TPage } from '../common/types/TPages';
// globalThis.ASYNC_VALIDATOR_NO_WARNING = 1;

type Props = AppProps & {
  Component: TPage;
};

export default function MyApp({ Component, pageProps }: Props) {
  const getLayout = Component.getLayout || ((page) => page);

  return getLayout(<Component {...pageProps} />);
}
