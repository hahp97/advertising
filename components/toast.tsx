import { Dispatch, SetStateAction, useEffect } from 'react';

const ToastMessage = ({
  showToast,
  message,
  setShowToast,
}: {
  showToast: boolean;
  message: string;
  setShowToast: Dispatch<SetStateAction<boolean>>;
}) => {
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showToast, setShowToast]);

  return (
    <div className={`fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded ${showToast ? 'block' : 'hidden'}`}>
      {message}
    </div>
  );
};

export default ToastMessage;
