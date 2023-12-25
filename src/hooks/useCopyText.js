import { useCallback } from 'react';

const useCopyText = () => {
  const action = useCallback((str) => {
    const textArea = document.createElement('textarea');
    textArea.value = str;
    textArea.style.top = '0px';
    textArea.style.left = '0px';
    textArea.style.position = 'fixed';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
    } catch (error) {
      // ignore
    } finally {
      document.body.removeChild(textArea);
    }
  }, []);

  return action;
};

export default useCopyText;
