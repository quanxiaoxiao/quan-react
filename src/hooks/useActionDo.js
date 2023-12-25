import {
  useRef,
  useEffect,
  useLayoutEffect,
  useCallback,
  useMemo,
} from 'react';
import useAction from './useAction';

const useActionDo = (params, options) => {
  const waitingSaved = useRef(false);
  const argsSaved = useRef([]);
  const paramsSaved = useRef();
  const lastParamsSaved = useRef();

  const actionOptions = useMemo(() => ({
    ...options,
    resolve: (...args) => {
      if (options.resolve && lastParamsSaved.current === paramsSaved.current) {
        options.resolve(...args);
      }
    },
  }), [options]);

  const {
    pending,
    action,
  } = useAction(actionOptions);

  const actionSaved = useRef(action);

  useLayoutEffect(() => {
    actionSaved.current = action;
  });

  const executeAction = useCallback((...args) => {
    if (pending) {
      waitingSaved.current = true;
      argsSaved.current = args;
    } else {
      argsSaved.current = [];
      lastParamsSaved.current = paramsSaved.current;
      actionSaved.current(paramsSaved.current, ...args);
    }
  }, [pending]);

  useEffect(() => {
    const p = params == null ? null : params;
    if (paramsSaved.current !== p) {
      paramsSaved.current = p;
      executeAction();
    }
  }, [params, executeAction]);

  useEffect(() => {
    if (!pending && waitingSaved.current) {
      waitingSaved.current = false;
      requestAnimationFrame(() => {
        lastParamsSaved.current = paramsSaved.current;
        actionSaved.current(lastParamsSaved.current, ...argsSaved.current);
        argsSaved.current = [];
      });
    }
  }, [pending]);

  return {
    pending,
    action: executeAction,
  };
};

export default useActionDo;
