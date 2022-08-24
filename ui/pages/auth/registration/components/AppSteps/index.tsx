import { Button, message, Steps } from 'antd';
import { useState, Children } from 'react';
import { IProps } from '../../../../../common/interface/IProps';
import styles from './style.module.scss';

const { Step } = Steps;

// const stepsNames = [
//   {
//     title: 'First',
//     content: 'First-content',
//   },
//   {
//     title: 'Second',
//     content: 'Second-content',
//   },
//   {
//     title: 'Last',
//     content: 'Last-content',
//   },
// ];

const AppSteps: React.FC<IProps & { next; prev; current; stepTitles }> = ({
  children,
  next,
  prev,
  current,
  stepTitles,
}) => {
  const steps = Children.map(children, (child, idx) => {
    return { content: child, title: stepTitles[idx] };
  });

  return (
    <>
      <Steps current={current}>
        {steps.map((item) => (
          <Step key={item.title} title={item.title} />
        ))}
      </Steps>
      <div className={styles.stepsContent}>{steps[current].content}</div>
    </>
  );
};

export default AppSteps;
