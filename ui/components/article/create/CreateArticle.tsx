import AppArticleForm from '../AppArticleForm';
import { useAlertContext } from '../../../context/alertContext';
import { axiosInstance } from '../../../utils/axios';

const CreateArticle = () => {
  const { setAlert } = useAlertContext();
  const submitForm = async (formValues) => {
    const resp = await axiosInstance.post('/articles', formValues);
    setAlert({ message: 'Article created!' });
    return resp;
  };

  return (
    <div>
      <h1>Edit article</h1>

      <AppArticleForm submitForm={submitForm} />
    </div>
  );
};

export default CreateArticle;
