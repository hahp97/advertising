// useToast.js
import { SetStateAction, useEffect, useState } from 'react';

const useToast = () => {
  const [showToast, setShowToast] = useState(false);
  const [message, setMessage] = useState('');

  const showToastMessage = (mess: SetStateAction<string>) => {
    setMessage(mess);
    setShowToast(true);
  };

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showToast]);

  return {
    showToast: showToastMessage,
    toastProps: { showToast, setShowToast, message },
  };
};

export default useToast;
