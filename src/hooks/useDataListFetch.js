import {
  useState,
  useLayoutEffect,
  useRef,
} from 'react';
import request from '../request';
import useActionDo from './useActionDo';

const noop = (v) => v;

const useDataListFetch = (api, handler = noop) => {
  const handlerSaved = useRef(handler);
  useLayoutEffect(() => {
    handlerSaved.current = handler;
  }, [handler]);
  const [list, setList] = useState([]);
  const { pending } = useActionDo(api, {
    pre: () => setList([]),
    match: (v) => !!v,
    fn: async (url) => {
      const ret = await request.get(url);
      const arr = handlerSaved.current(ret);
      if (!Array.isArray(arr)) {
        throw new Error('data is not array type');
      }
      return arr;
    },
    resolve: (ret) => setList(ret),
  });

  return {
    pending,
    list,
    changeList: setList,
  };
};

export default useDataListFetch;
