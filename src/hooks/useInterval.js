import { useRef, useEffect } from 'react';

const useInterval = (callback, delay) => {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  });

  useEffect(() => {
    function tick() {
      savedCallback.current();
    }

    const _id = setInterval(tick, delay);
    return () => clearInterval(_id);
  }, [delay]);
};

export default useInterval;
