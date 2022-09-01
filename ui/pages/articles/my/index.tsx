import { NextPageContext } from 'next';

import { TNextPageWithLayout } from '../../../common/types/TNextPageWithLayout';
import BasicLayout from '../../../layouts/BasicLayout';
import MyArticles from './components/MyArticles';

type PageProps = {
  articles: string;
};

type PageContext = NextPageContext & {
  query: PageProps;
};

const myArticlePage: TNextPageWithLayout<PageProps> = ({ articles }) => {
  return <MyArticles />;
};

myArticlePage.getLayout = (page) => {
  return <BasicLayout needAuth>{page}</BasicLayout>;
};

myArticlePage.getInitialProps = (ctx: PageContext) => {
  return {
    articles: ctx.query.articles,
  };
};

export default myArticlePage;
