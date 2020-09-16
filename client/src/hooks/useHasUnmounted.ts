import {useRef, useEffect} from "react"

const useHasUnmounted = () => {
  const hasUnmounted = useRef(false);
  useEffect(() => {
    return () => {
        hasUnmounted.current = true;
    };
  }, []);
  return hasUnmounted;
};

export default useHasUnmounted;