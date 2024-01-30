import Input from '@/components/input';
import { useState } from 'react';

interface ConfigFormProps {
  onSave: (data: { titleElement: string; alertMessageBtn: string | undefined }) => void;
  inputTitle: string;
  initialData?: { titleElement: string; alertMessageBtn: string };
  type: 'text' | 'button';
  alertMessage?: string;
}

type RequireAlertMessage<T> = T extends { type: 'button' } ? { alertMessage: string } : {};

type FinalConfigFormProps = ConfigFormProps & RequireAlertMessage<ConfigFormProps>;

const ConfigForm = ({
  onSave,
  inputTitle,
  initialData = { titleElement: '', alertMessageBtn: '' },
  type,
}: FinalConfigFormProps) => {
  const [title, setTitle] = useState(initialData.titleElement);
  const [alertMessage, setAlertMessage] = useState(initialData.alertMessageBtn);

  const handleSave = () => {
    onSave({
      titleElement: title,
      alertMessageBtn: alertMessage,
    });
  };

  return (
    <div className="p-4 border border-gray-300 rounded shadow">
      {type === 'text' ? (
        <div className="mb-4">
          <Input
            label={inputTitle}
            type="text"
            id="title"
            placeholder="Enter value for Input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
      ) : (
        <>
          <div className="mb-4">
            <Input
              label={inputTitle}
              type="text"
              id="title"
              placeholder="Enter value for Input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <Input
              label="Alert Message"
              type="text"
              id="alert"
              placeholder="Enter value for Input"
              value={alertMessage}
              onChange={(e) => setAlertMessage(e.target.value)}
            />
          </div>
        </>
      )}
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        onClick={handleSave}
      >
        Save
      </button>
    </div>
  );
};

export default ConfigForm;
