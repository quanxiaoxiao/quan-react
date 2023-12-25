import {
  useMemo,
  useState,
  useEffect,
  useRef,
  useLayoutEffect,
} from 'react';
import qs from 'qs';

const defaultEncode = (v) => qs.stringify(v);

const useQueryString = (
  params,
  tickTime = 0,
  encode = defaultEncode,
) => {
  const mountedSaved = useRef();
  const paramsSaved = useRef(params);
  const tickTimeSaved = useRef(tickTime);
  const encodeSaved = useRef(encode);

  const paramsEncoded = useMemo(() => {
    if (params == null || !encodeSaved.current) {
      return '';
    }
    return encodeSaved.current(params);
  }, [params]);

  const [queryString, setQueryString] = useState(paramsEncoded);

  useLayoutEffect(() => {
    encodeSaved.current = encode;
    paramsSaved.current = params;
    return () => {
      encodeSaved.current = null;
      paramsSaved.current = null;
    };
  }, [encode, params]);

  useLayoutEffect(() => {
    mountedSaved.current = true;
    return () => {
      mountedSaved.current = false;
    };
  }, []);

  useEffect(() => {
    if (mountedSaved.current
      && paramsSaved.current
      && encodeSaved.current
    ) {
      setQueryString(encodeSaved.current(paramsSaved.current));
    }
  }, []);

  useEffect(() => {
    tickTimeSaved.current = tickTime;
  }, [tickTime]);

  useEffect(() => {
    const tickID = setTimeout(() => {
      if (mountedSaved.current) {
        setQueryString(paramsEncoded);
      }
    }, tickTimeSaved.current);
    return () => {
      clearTimeout(tickID);
    };
  }, [paramsEncoded]);

  return queryString;
};

export default useQueryString;
