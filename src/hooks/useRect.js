import { useMemo } from 'react';

const useRect = (
  containerWidth,
  containerHeight,
  margin,
) => {
  const w = useMemo(() => {
    if (typeof containerWidth !== 'number' || containerWidth < 0) {
      return 0;
    }
    return containerWidth;
  }, [containerWidth]);

  const h = useMemo(() => {
    if (typeof containerHeight !== 'number' || containerHeight < 0) {
      return 0;
    }
    return containerHeight;
  }, [containerHeight]);

  const marginLeft = useMemo(() => {
    if (!margin || typeof margin.left !== 'number' || margin.left < 0) {
      return 0;
    }
    if (margin.left > w) {
      return w;
    }
    return margin.left;
  }, [margin, w]);

  const marginTop = useMemo(() => {
    if (!margin || typeof margin.top !== 'number' || margin.top < 0) {
      return 0;
    }
    if (margin.top > h) {
      return h;
    }
    return margin.top;
  }, [margin, h]);

  const marginRight = useMemo(() => {
    if (!margin || typeof margin.right !== 'number' || margin.right < 0) {
      return 0;
    }
    if (margin.right > w - marginLeft) {
      return w - marginLeft;
    }
    return margin.right;
  }, [
    margin,
    marginLeft,
    w,
  ]);

  const marginBottom = useMemo(() => {
    if (!margin || typeof margin.bottom !== 'number' || margin.bottom < 0) {
      return 0;
    }
    if (margin.bottom > h - marginTop) {
      return h - marginTop;
    }
    return margin.bottom;
  }, [
    margin,
    marginTop,
    h,
  ]);

  const clientRect = useMemo(() => ({
    margin: {
      top: marginTop,
      x: marginLeft,
      y: marginTop,
      left: marginLeft,
      right: marginRight,
      bottom: marginBottom,
    },
    width: Math.max(w - marginLeft - marginRight, 0),
    height: Math.max(h - marginTop - marginBottom, 0),
    containerWidth: w,
    containerHeight: h,
  }), [
    marginTop,
    marginLeft,
    marginRight,
    marginBottom,
    w,
    h,
  ]);

  return clientRect;
};

export default useRect;
