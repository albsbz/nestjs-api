import BasicLayout from '../../../layouts/BasicLayout';
import EditArticle from './components/EditArticle';

const editArticlePage = () => {
  return <EditArticle />;
};

editArticlePage.getLayout = (page) => {
  return <BasicLayout needAuth>{page}</BasicLayout>;
};

export default editArticlePage;
