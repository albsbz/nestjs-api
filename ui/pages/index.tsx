import { NextPage } from 'next';
import React from 'react';
import BasicLayout from '../components/layouts/BasicLayout';
import { Page } from '../common/types/pages';

const BlogApp: Page = () => {
  return <h1>Home</h1>;
};

BlogApp.getLayout = (page) => {
  return <BasicLayout>{page}</BasicLayout>;
};
// export async function getStaticProps() {
//   return {
//     props: {}, // will be passed to the page component as props
//   };
// }

export default BlogApp;
