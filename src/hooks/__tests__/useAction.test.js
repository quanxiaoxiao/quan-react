import {
  test,
  jest,
  expect,
} from '@jest/globals';
import { renderHook, act } from '@testing-library/react-hooks';
import useAction from '../useAction';

test('1', async () => {
  const onPre = jest.fn();
  const onMatch = jest.fn();
  const onRun = jest.fn(() => 'bbb');
  const onResolve = jest.fn();
  const onReject = jest.fn();

  const { result, waitForNextUpdate } = renderHook(() => useAction({
    pre: onPre,
    match: onMatch,
    fn: onRun,
    reject: onReject,
    resolve: onResolve,
  }));

  expect(result.current.pending).toBeNull();

  act(() => {
    result.current.action('aaa');
  });

  expect(onMatch).toHaveBeenCalled();
  expect(onPre).toHaveBeenCalledWith(true, 'aaa');
  expect(onRun).toHaveBeenCalledWith('aaa');

  expect(result.current.pending).toBeTruthy();

  await waitForNextUpdate();

  expect(onResolve).toHaveBeenCalledWith('bbb');
  expect(onReject).toHaveBeenCalledTimes(0);

  expect(result.current.pending).toBeFalsy();
});

test('match false', async () => {
  const onPre = jest.fn();
  const onMatch = jest.fn(() => false);
  const onRun = jest.fn();
  const onResolve = jest.fn();
  const onReject = jest.fn();

  const { result } = renderHook(() => useAction({
    pre: onPre,
    match: onMatch,
    fn: onRun,
    reject: onReject,
    resolve: onResolve,
  }));

  await expect(result.current.pending).toBeNull();

  act(() => {
    result.current.action('aaa');
  });

  expect(onMatch).toHaveBeenCalled();
  expect(onPre).toHaveBeenCalledWith(false, 'aaa');
  expect(result.current.pending).toBeFalsy();
  expect(onRun).toHaveBeenCalledTimes(0);

  expect(onResolve).toHaveBeenCalledTimes(0);
  expect(onReject).toHaveBeenCalledTimes(0);

  expect(result.current.pending).toBeFalsy();
});

test('reject', () => {
  const onResolve = jest.fn();
  const onReject = jest.fn();

  const { result } = renderHook(() => useAction({
    fn: () => {
      throw new Error();
    },
    reject: onReject,
    resolve: onResolve,
  }));

  expect(result.current.pending).toBeNull();

  act(() => {
    result.current.action('aaa');
  });

  expect(onResolve).toHaveBeenCalledTimes(0);
  expect(onReject).toHaveBeenCalledTimes(1);

  expect(result.current.pending).toBeFalsy();
});

test('duplicate resolve', async () => {
  const onResolve = jest.fn();
  const onReject = jest.fn();

  const { result, waitForNextUpdate } = renderHook(() => useAction({
    fn: async () => {
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, 500);
      });
    },
    reject: onReject,
    resolve: onResolve,
  }));

  expect(result.current.pending).toBeNull();

  act(() => {
    result.current.action('aaa');
    result.current.action('aaa');
  });

  expect(result.current.pending).toBeTruthy();
  await waitForNextUpdate();

  expect(result.current.pending).toBeFalsy();
  expect(onResolve).toHaveBeenCalledTimes(1);
  expect(onReject).toHaveBeenCalledTimes(0);
});

test('duplicate reject', async () => {
  const onResolve = jest.fn();
  const onReject = jest.fn();

  const { result, waitForNextUpdate } = renderHook(() => useAction({
    fn: async () => {
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          reject();
        }, 500);
      });
    },
    reject: onReject,
    resolve: onResolve,
  }));

  expect(result.current.pending).toBeNull();

  act(() => {
    result.current.action('aaa');
    result.current.action('aaa');
  });

  expect(result.current.pending).toBeTruthy();
  await waitForNextUpdate();

  expect(result.current.pending).toBeFalsy();
  expect(onResolve).toHaveBeenCalledTimes(0);
  expect(onReject).toHaveBeenCalledTimes(1);
});
