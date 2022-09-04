import { NextPageContext } from 'next';
import BasicLayout from '../../../layouts/BasicLayout';
import { axiosInstance } from '../../../utils/axios';
import ArticlePage from '../../../components/article/[slug]/ArticlePage';

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
  let resp;
  try {
    resp = await axiosInstance.post('articles/slugs');
  } catch (error) {
  } finally {
    return {
      paths: resp?.data?.map((el) => ({ params: el })) || [],
      fallback: false, // can also be true or 'blocking'
    };
  }
}

export const getStaticProps = async (ctx: PageContext) => {
  let resp;
  try {
    resp = await axiosInstance.get(`articles/${ctx.params.slug}`);
  } catch (error) {
  } finally {
    if (resp.data) {
      return {
        props: { article: resp.data },
        revalidate: 10,
      };
    }
    return;
  }
};

export default articlePage;
