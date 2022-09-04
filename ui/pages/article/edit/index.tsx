import BasicLayout from '../../../layouts/BasicLayout';
import EditArticle from '../../../components/article/edit/EditArticle';

const editArticlePage = () => {
  return <EditArticle />;
};

editArticlePage.getLayout = (page) => {
  return <BasicLayout needAuth>{page}</BasicLayout>;
};

export default editArticlePage;
