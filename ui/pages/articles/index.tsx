import { NextPageContext } from 'next';

import { TNextPageWithLayout } from '../../common/types/TNextPageWithLayout';
import BasicLayout from '../../layouts/BasicLayout';
import Articles from './components/Articles';

type PageProps = {
  articles: string;
};

type PageContext = NextPageContext & {
  query: PageProps;
};

const articlePage: TNextPageWithLayout<PageProps> = ({ articles }) => {
  return <Articles articles={articles} />;
};

articlePage.getLayout = (page) => {
  return <BasicLayout needAuth>{page}</BasicLayout>;
};

articlePage.getInitialProps = (ctx: PageContext) => {
  return {
    articles: ctx.query.articles,
  };
};

export default articlePage;
