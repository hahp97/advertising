import React, { ChangeEvent, useState } from 'react';

interface LabelProps {
  initialContent: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const Label = ({ initialContent, onChange }: LabelProps) => {
  const [content, setContent] = useState(initialContent);
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    onChange({ target: { value: content } } as React.ChangeEvent<HTMLInputElement>);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setContent(event.target.value);
  };

  return (
    <div>
      {isEditing ? (
        <input
          type="text"
          value={content}
          onChange={handleChange}
          onBlur={handleSave}
          autoFocus
          className="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-blue-500 w-full"
        />
      ) : (
        <text
          onClick={handleEdit}
          className="cursor-pointer p-2 w-full "
        >
          {content}
        </text>
      )}
    </div>
  );
};

export default Label;
