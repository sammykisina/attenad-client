import { useEffect, useState } from "react";

const useDebounceValue = (value: string, time = 250) => {
  const [debounce_value, setDebounceValue] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebounceValue(value);
    }, time);

    return () => {
      clearTimeout(timeout);
    };
  }, [value, time]);

  return debounce_value;
};

export default useDebounceValue;
