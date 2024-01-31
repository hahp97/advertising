import { Element } from '@/types/element';
import { useState } from 'react';

const useLocalStorage = (key: string, initialValue: Element[]) => {
  const [state, setState] = useState(() => {
    try {
      const value = window.localStorage.getItem(key);

      return value ? JSON.parse(value) : initialValue;
    } catch (error) {
      alert(error);
    }
  });

  const setValue = (value: any) => {
    try {
      const valueToStore = value instanceof Function ? value(state) : value;
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
      setState(value);
    } catch (error) {
      alert(error);
    }
  };

  return [state, setValue];
};

export default useLocalStorage;
