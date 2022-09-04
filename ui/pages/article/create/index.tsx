import BasicLayout from '../../../layouts/BasicLayout';
import CreateArticle from '../../../components/article/create/CreateArticle';

const createArticlePage = () => {
  return <CreateArticle />;
};

createArticlePage.getLayout = (page) => {
  return <BasicLayout needAuth>{page}</BasicLayout>;
};

export default createArticlePage;
