import AppArticleForm from '../AppArticleForm';
import { useAlertContext } from '../../../context/alertContext';
import { axiosInstance } from '../../../utils/axios';
import { memo } from 'react';

const CreateArticle = () => {
  const { setAlert } = useAlertContext();
  const submitForm = async (formValues) => {
    const resp = await axiosInstance.post('/articles', formValues);
    setAlert({ message: 'Article created!' });
    return resp;
  };

  return (
    <div>
      <h1>Create article</h1>

      <AppArticleForm submitForm={submitForm} />
    </div>
  );
};

export default memo(CreateArticle);
