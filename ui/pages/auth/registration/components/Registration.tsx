import { Button, Form, Space } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import AppButton from '../../../../components/Button';
import GoogleButton from '../../../../components/GoogleButton';
import AppInput from '../../../../components/Input';
import styles from './style.module.scss';
import { axiosInstance } from '../../../../utils/axios';
import { useErrorHandler } from 'react-error-boundary';
import useAsyncError from '../../../../hooks/useAsyncError';
import { useAuthContext } from '../../../../context/authContext';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useAlertContext } from '../../../../context/alertContext';
import AppSteps from './AppSteps';
import RegistrationStep from './Steps/RegistrationStep';
import PreferencesStep from './Steps/PreferencesStep';

const Registration = () => {
  const [current, setCurrent] = useState(0);

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const stepTitles = ['Registration', 'Preferences'];
  return (
    <AppSteps next={next} prev={prev} current={current} stepTitles={stepTitles}>
      <RegistrationStep next={next} />
      <PreferencesStep />
    </AppSteps>
  );
};

export default Registration;
