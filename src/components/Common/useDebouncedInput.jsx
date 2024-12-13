import { useState } from 'react';

const useDebouncedInput = (initialValue, delay = 300) => {
  const [value, setValue] = useState(initialValue);
  let debounceTimer;

  const handleInputChange = e => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      setValue(e.target.value);
    }, delay);
  };

  return [value, handleInputChange];
};

export default useDebouncedInput;
