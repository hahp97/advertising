'use client';

import { Element } from '@/types/element';

const Consumer = () => {
  const data = localStorage.getItem('data');

  if (!data) {
    return <div>No data</div>;
  }

  const dataView = JSON.parse(data);

  return (
    <div>
      <div className="flex">
        {dataView.map((element: Element, index: number) => (
          <div
            key={index}
            className="bg-gray-300 p-2 rounded-md"
          >
            {element.type === 'text' && <div>{element.props.text || 'paparph'}</div>}
            {element.type === 'button' && (
              <button
                onClick={() => {
                  alert(element.props.alert);
                }}
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
