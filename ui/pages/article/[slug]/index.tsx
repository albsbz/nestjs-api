import { NextPageContext } from 'next';
import BasicLayout from '../../../layouts/BasicLayout';
import { axiosInstance } from '../../../utils/axios';
import ArticlePage from './components/ArticlePage';

type PageProps = {
  slug: string;
};

type PageContext = NextPageContext & {
  params: PageProps;
};

const articlePage = ({ article }) => {
  return <ArticlePage article={article} />;
};

articlePage.getLayout = (page) => {
  return <BasicLayout>{page}</BasicLayout>;
};

export async function getStaticPaths() {
  const resp = await axiosInstance.post('articles/slugs');
  return {
    paths: resp.data.map((el) => ({ params: el })),
    fallback: false, // can also be true or 'blocking'
  };
}

export const getStaticProps = async (ctx: PageContext) => {
  const resp = await axiosInstance.get(`articles/${ctx.params.slug}`);
  if (resp.data) {
    return {
      props: { article: resp.data },
    };
  }
  return;
};

export default articlePage;
