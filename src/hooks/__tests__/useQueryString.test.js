import {
  test,
  expect,
} from '@jest/globals';
import { renderHook } from '@testing-library/react-hooks';
import useQueryString from '../useQueryString';

test('1', () => {
  const { result } = renderHook(() => useQueryString({}));
  expect(result.current).toBe('');
});

test('2', () => {
  const { result } = renderHook(() => useQueryString({ name: 'quan', age: 22 }));
  expect(result.current).toBe('name=quan&age=22');
});

test('3', () => {
  const { result } = renderHook(() => useQueryString({ name: 'quan', age: 22 }, 10, (d) => d.name));
  expect(result.current).toBe('quan');
});
