import {
  useState,
  useRef,
  useCallback,
  useLayoutEffect,
} from 'react';

const useAction = (options) => {
  const [pending, setPending] = useState(null);
  const optionsSaved = useRef(options);
  const pendingSaved = useRef(null);

  useLayoutEffect(() => {
    optionsSaved.current = options;
    return () => {
      optionsSaved.current = null;
    };
  });

  const action = useCallback(async (...args) => {
    if (!optionsSaved.current || pendingSaved.current) {
      return null;
    }
    pendingSaved.current = true;
    let matched = optionsSaved.current.match ? optionsSaved.current.match(...args) : true;
    if (typeof matched !== 'boolean') {
      matched = true;
    }
    if (optionsSaved.current.pre) {
      optionsSaved.current.pre(matched, ...args);
    }
    if (!matched) {
      pendingSaved.current = false;
      setPending(false);
      return null;
    }

    setPending(true);

    try {
      const ret = await optionsSaved.current.fn(...args);
      if (optionsSaved.current && optionsSaved.current.resolve) {
        return optionsSaved.current.resolve(ret);
      }
      return ret;
    } catch (error) {
      if (optionsSaved.current && optionsSaved.current.reject) {
        optionsSaved.current.reject(error);
      } else if (process.env.NODE_ENV === 'development') {
        console.error(error);
      }
      return null;
    } finally {
      if (optionsSaved.current) {
        pendingSaved.current = false;
        setPending(false);
        if (optionsSaved.current.final) {
          optionsSaved.current.final();
        }
      }
    }
  }, []);

  return {
    action,
    pending,
  };
};

export default useAction;
