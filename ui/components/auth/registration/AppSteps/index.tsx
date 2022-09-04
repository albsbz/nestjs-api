import { Button, message, Steps } from 'antd';
import { useState, Children } from 'react';
import { IProps } from '../../../../common/interface/IProps';
import styles from './style.module.scss';

const { Step } = Steps;

const AppSteps: React.FC<IProps & { next; prev; current; stepTitles }> = ({
  children,
  next,
  prev,
  current,
  stepTitles,
}) => {
  const steps = Children
    ? Children.map(children, (child, idx) => {
        return { content: child, title: stepTitles[idx] };
      })
    : null;

  return (
    <>
      <Steps current={current}>
        {steps ? (
          steps.map((item) => <Step key={item.title} title={item.title} />)
        ) : (
          <Step />
        )}
      </Steps>
      <div className={styles.stepsContent}>
        {steps ? steps[current].content : ''}
      </div>
    </>
  );
};

export default AppSteps;
