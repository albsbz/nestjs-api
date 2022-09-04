import { useRouter } from 'next/router';
import { useState } from 'react';
import { Skeleton } from 'antd';
import AppArticleForm from '../../../../components/article/AppArticleForm';
import { axiosInstance } from '../../../../utils/axios';
import { useAlertContext } from '../../../../context/alertContext';

let didInit = false;
const EditArticle = () => {
  const [article, setArticle] = useState();
  const router = useRouter();
  const { setAlert } = useAlertContext();

  const getArticle = async () => {
    const resp = await axiosInstance.get(`articles/id/${router.query.id}`);
    setArticle(resp.data);
  };
  if (!didInit && router?.query?.id) {
    getArticle();
    didInit = true;
  }

  const submitForm = async (formValues) => {
    const resp = await axiosInstance.patch(
      `/articles/${router?.query?.id}`,
      formValues,
    );
    setAlert({ message: 'Article updated!' });
    return resp;
  };

  return (
    <div>
      <h1>Edit article</h1>
      {article ? (
        <AppArticleForm initialValues={article} submitForm={submitForm} />
      ) : (
        <Skeleton></Skeleton>
      )}
    </div>
  );
};

export default EditArticle;
