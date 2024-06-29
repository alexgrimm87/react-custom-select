import {useRef, useCallback} from "react";

const useDebouncedCallback = (callback, delay) => {
  const callbackRef = useRef(callback);
  const timerRef = useRef();

  return useCallback(
    (...args) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = setTimeout(() => {
        callbackRef.current(...args);
      }, delay);
    },
    []
  );
};

export default useDebouncedCallback;
