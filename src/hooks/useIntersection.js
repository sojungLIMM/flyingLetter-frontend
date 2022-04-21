import { useEffect, useCallback, useRef } from "react";

const options = {
  root: null,
  rootMargin: "1px",
  threshold: "1",
};

function useIntersection(onIntersect, isNext) {
  const targetObserver = useRef();

  const checkIntersect = useCallback(
    (entries) => {
      if (entries[0].isIntersecting && isNext) {
        onIntersect((prevPage) => prevPage + 1);
      }
    },
    [isNext]
  );

  useEffect(() => {
    let observer;
    let targetElement;

    if (targetObserver.current) {
      targetElement = targetObserver.current;
      observer = new IntersectionObserver(checkIntersect, options);
      observer.observe(targetElement);
    }
    return () => {
      observer?.disconnect(targetElement);
    };
  }, [targetObserver.current, checkIntersect]);

  return targetObserver;
}

export default useIntersection;
