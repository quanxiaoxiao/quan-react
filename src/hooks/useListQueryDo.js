import {
  useRef,
  useState,
  useMemo,
  useEffect,
  useLayoutEffect,
} from 'react';
import qs from 'qs';
import request from '../request';
import useActionDo from './useActionDo';
import useQueryString from './useQueryString';

const _format = (d) => qs.stringify(d);

const _handler = (ret) => ({
  count: ret?.count ?? 0,
  list: Array.isArray(ret?.list) ? ret.list : [],
});

const useListQueryDo = ({
  query = {},
  api,
  format = _format,
  handler = _handler,
  limit = 30,
}) => {
  const [list, setList] = useState([]);
  const [skip, setSkip] = useState(0);
  const [count, setCount] = useState(0);
  const handlerSaved = useRef(handler);

  const queryify = useMemo(() => JSON.stringify(query), [query]);

  useLayoutEffect(() => {
    handlerSaved.current = handler;
    return () => {
      handlerSaved.current = null;
    };
  }, [handler]);

  const queryString = useQueryString({
    ...query,
    skip,
    limit,
  }, 10, format);

  const url = useMemo(() => {
    if (!queryString || !api) {
      return null;
    }
    return `${api}?${queryString}`;
  }, [api, queryString]);

  useEffect(() => {
    setSkip(0);
    setCount(0);
    setList([]);
  }, [queryify, api]);

  const { pending, action } = useActionDo(url, {
    match: (v) => !!v,
    fn: (v) => request.get(v),
    resolve: (ret) => {
      if (handlerSaved.current) {
        const v = handlerSaved.current(ret);
        if (!v || !Array.isArray(v.list) || typeof v.count !== 'number') {
          throw new Error('data invalid');
        }
        setList(v.list);
        setCount(v.count);
      }
    },
  });

  const refresh = () => {
    if (skip === 0) {
      action();
    } else {
      setSkip(0);
    }
  };

  return {
    list,
    count,
    skip,
    pending,
    refresh,
    changeList: setList,
    changeSkip: setSkip,
  };
};

export default useListQueryDo;
