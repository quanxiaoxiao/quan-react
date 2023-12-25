import {
  test,
  expect,
} from '@jest/globals';
import { renderHook } from '@testing-library/react-hooks';
import useRect from '../useRect';

test('1', () => {
  const w = 20;
  const h = 10;
  const { result } = renderHook(() => useRect(w, h));
  expect(result.current.width).toBe(w);
  expect(result.current.height).toBe(h);
  expect(result.current.containerWidth).toBe(w);
  expect(result.current.containerHeight).toBe(h);
  expect(result.current.margin).toEqual({
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    x: 0,
    y: 0,
  });
});

test('2', () => {
  const w = 20;
  const h = 10;
  const margin = {
    top: 5,
    left: 5,
    right: 0,
    bottom: 0,
  };
  const { result } = renderHook(() => useRect(w, h, margin));
  expect(result.current.width).toBe(w - margin.left - margin.right);
  expect(result.current.height).toBe(h - margin.top - margin.bottom);
  expect(result.current.containerWidth).toBe(w);
  expect(result.current.containerHeight).toBe(h);
  expect(result.current.margin).toEqual({
    ...margin,
    x: margin.left,
    y: margin.top,
  });
});

test('2', () => {
  const w = 20;
  const h = 10;
  const margin = {
    top: 5,
    left: w + 2,
    right: 0,
    bottom: 0,
  };
  const { result } = renderHook(() => useRect(w, h, margin));
  expect(result.current.width).toBe(0);
  expect(result.current.height).toBe(h - margin.top - margin.bottom);
  expect(result.current.containerWidth).toBe(w);
  expect(result.current.containerHeight).toBe(h);
  expect(result.current.margin).toEqual({
    top: 5,
    left: w,
    right: 0,
    bottom: 0,
    x: w,
    y: 5,
  });
});

test('2', () => {
  const w = 20;
  const h = 10;
  const margin = {
    top: 5,
    left: 0,
    right: w + 2,
    bottom: 0,
  };
  const { result } = renderHook(() => useRect(w, h, margin));
  expect(result.current.width).toBe(0);
  expect(result.current.height).toBe(h - margin.top - margin.bottom);
  expect(result.current.containerWidth).toBe(w);
  expect(result.current.containerHeight).toBe(h);
  expect(result.current.margin).toEqual({
    top: 5,
    left: 0,
    right: w,
    bottom: 0,
    x: 0,
    y: 5,
  });
});

test('3', () => {
  const w = 20;
  const h = 10;
  const margin = {
    top: 5,
    left: 5,
    right: w + 2,
    bottom: 0,
  };
  const { result } = renderHook(() => useRect(w, h, margin));
  expect(result.current.width).toBe(0);
  expect(result.current.height).toBe(h - margin.top - margin.bottom);
  expect(result.current.containerWidth).toBe(w);
  expect(result.current.containerHeight).toBe(h);
  expect(result.current.margin).toEqual({
    top: 5,
    left: 5,
    right: w - margin.left,
    bottom: 0,
    x: 5,
    y: 5,
  });
});

test('3', () => {
  const w = 20;
  const h = 10;
  const margin = {
    top: 5,
    left: 5,
    right: w - 2,
    bottom: 0,
  };
  const { result } = renderHook(() => useRect(w, h, margin));
  expect(result.current.width).toBe(0);
  expect(result.current.height).toBe(h - margin.top - margin.bottom);
  expect(result.current.containerWidth).toBe(w);
  expect(result.current.containerHeight).toBe(h);
  expect(result.current.margin).toEqual({
    top: 5,
    left: 5,
    right: 15,
    bottom: 0,
    x: 5,
    y: 5,
  });
});

test('3', () => {
  const w = 20;
  const h = 10;
  const margin = {
    top: 5,
    left: 5,
    right: 5,
    bottom: 5,
  };
  const { result } = renderHook(() => useRect(w, h, margin));
  expect(result.current.width).toBe(10);
  expect(result.current.height).toBe(h - margin.top - margin.bottom);
  expect(result.current.containerWidth).toBe(w);
  expect(result.current.containerHeight).toBe(h);
  expect(result.current.margin).toEqual({
    top: 5,
    left: 5,
    right: 5,
    bottom: 5,
    x: 5,
    y: 5,
  });
});

test('4', () => {
  const w = -10;
  const h = 10;
  const margin = {
    top: 5,
    left: 5,
    right: 5,
    bottom: 5,
  };
  const { result } = renderHook(() => useRect(w, h, margin));
  expect(result.current.width).toBe(0);
  expect(result.current.height).toBe(h - margin.top - margin.bottom);
  expect(result.current.containerWidth).toBe(0);
  expect(result.current.containerHeight).toBe(h);
  expect(result.current.margin).toEqual({
    top: 5,
    left: 0,
    right: 0,
    bottom: 5,
    x: 0,
    y: 5,
  });
});
