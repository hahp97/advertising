'use client';

import { Element } from '@/types/element';
import { useEffect, useState } from 'react';

const Consumer = () => {
  const [dataView, setDataView] = useState<Element[]>([]);

  useEffect(() => {
    const data = localStorage.getItem('data');
    if (data) {
      setDataView(JSON.parse(data));
    }
  }, []);

  return (
    <div>
      <div className="flex flex-col gap-4 items-center pt-10">
        {dataView.map((element: Element, index: number) => (
          <div
            key={index}
            className="bg-gray-300 p-4 rounded-md shadow-md flex items-center justify-center"
          >
            {element.type === 'text' && (
              <div className="text-gray-700 text-sm">{element.props.text || 'Paragraph'}</div>
            )}
            {element.type === 'button' && (
              <button
                onClick={() => {
                  alert(element.props.alert);
                }}
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
              >
                {element.props.text || 'Button'}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Consumer;
