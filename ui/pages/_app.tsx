import { AppProps } from 'next/app';
import { Page } from '../common/types/pages';
// globalThis.ASYNC_VALIDATOR_NO_WARNING = 1;

type Props = AppProps & {
  Component: Page;
};

export default function MyApp({ Component, pageProps }: Props) {
  const getLayout = Component.getLayout || ((page) => page);

  return getLayout(<Component {...pageProps} />);
}
