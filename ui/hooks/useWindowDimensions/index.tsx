import { useState, useEffect, useLayoutEffect } from 'react';
import { WindowSize } from '../../common/enums';
enum minWidth {
  small = 576,
  medium = 768,
  large = 992,
  extraLarge = 1200,
}

const useWindowDimensions = () => {
  const [windowDimensions, setWindowDimensions] = useState({
    width: 0,
    height: 0,
  });
  const [windowSize, setwindowSize] = useState(WindowSize.small);
  useEffect(() => {
    handleResize();
    function getWindowDimensions() {
      if (!window) return;
      const { innerWidth: width, innerHeight: height } = window;
      return {
        width,
        height,
      };
    }
    function getSize() {
      if (!window) return;
      const { innerWidth: width } = window;
      if (width > minWidth.extraLarge) return WindowSize.extraLarge;
      if (width > minWidth.large) return WindowSize.large;
      if (width > minWidth.medium) return WindowSize.medium;
      return WindowSize.small;
    }
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
      setwindowSize(getSize());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return { windowDimensions, windowSize };
};
export default useWindowDimensions;
