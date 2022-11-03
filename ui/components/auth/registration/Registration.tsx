import { useState } from 'react';

import AppSteps from './AppSteps';
import RegistrationStep from './Steps/RegistrationStep';
import PreferencesStep from './Steps/PreferencesStep';
import useInitAuth from '../../../hooks/useInitAuth';

const Registration = () => {
  const [current, setCurrent] = useState(0);
  const { initAuth } = useInitAuth();

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const stepTitles = ['Registration', 'Preferences'];
  return (
    initAuth && (
      <AppSteps
        next={next}
        prev={prev}
        current={current}
        stepTitles={stepTitles}
      >
        <RegistrationStep next={next} />
        <PreferencesStep />
      </AppSteps>
    )
  );
};

export default Registration;
