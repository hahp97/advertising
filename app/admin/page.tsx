'use client';

import { initialPosition } from '@/constants/initialData';
import { Element } from '@/types/element';
import { ElementPosition } from '@/types/elementPosition';
import { DragEvent, useState } from 'react';

const AdminPage = () => {
  const [elements, setElements] = useState<Element[]>([]);

  const [dragAndDrop, setDragAndDrop] = useState<ElementPosition>(initialPosition);

  const handleOnDrag = (e: DragEvent, elementType: string) => {
    (e.dataTransfer as DataTransfer).setData('elementType', elementType);
  };

  const handleOnDrop = (e: DragEvent) => {
    const elementType = (e.dataTransfer as DataTransfer).getData('elementType') as string;
    const newElement: Element = { type: elementType, id: new Date().getTime() };

    setElements([...elements, newElement]);
  };

  const handleOnDragOver = (e: DragEvent) => {
    e.preventDefault();
  };

  const onDragStart = (e: DragEvent) => {
    const currentPosition = Number((e.currentTarget as HTMLElement).dataset.position);
    setDragAndDrop({ ...dragAndDrop, draggedFrom: currentPosition, isDragging: true, originalOrder: elements });

    // using for firefox
    e.dataTransfer.setData('text/html', '');
  };

  const onDragOver = (e: DragEvent) => {
    e.preventDefault();

    let newList = dragAndDrop.originalOrder;

    const draggedFrom = dragAndDrop.draggedFrom;

    const draggedTo = Number((e.currentTarget as HTMLElement).dataset.position);

    if (draggedFrom !== draggedTo) {
      const itemDragged = newList && newList[draggedFrom!];
      const remainingItems = newList.filter((_, index) => index !== draggedFrom);

      newList = [...remainingItems.slice(0, draggedTo), itemDragged, ...remainingItems.slice(draggedTo)];

      if (draggedTo !== dragAndDrop.draggedTo) {
        setDragAndDrop({
          ...dragAndDrop,
          updatedOrder: newList,
          draggedTo: draggedTo,
        });
      }
    }
  };

  const onDrop = (e: DragEvent) => {
    if (dragAndDrop.draggedFrom !== null && dragAndDrop.draggedTo !== null) {
      setElements(dragAndDrop.updatedOrder);
    }
    setDragAndDrop({ ...dragAndDrop, draggedFrom: null, draggedTo: null, isDragging: false });
  };

  const onDragLeave = () => {
    setDragAndDrop({
      ...dragAndDrop,
      draggedTo: null,
    });
  };

  return (
    <div>
      <div className="flex">
        <div className="w-1/4">
          <div className="bg-gray-200 p-2 rounded-md">
            <div
              className="bg-gray-300 p-2 rounded-md"
              draggable
              onDragStart={(e) => handleOnDrag(e, 'text')}
            >
              Text
            </div>
            <div
              className="bg-gray-300 p-2 rounded-md"
              draggable
              onDragStart={(e) => handleOnDrag(e, 'image')}
            >
              Image
            </div>
          </div>
        </div>
        <div
          className="w-3/4 bg-gray-100 p-2 rounded-md"
          onDrop={handleOnDrop}
          onDragOver={handleOnDragOver}
        >
          <section>
            <ul>
              {elements.map((element, index) => (
                <li
                  key={index}
                  data-position={index}
                  draggable
                  onDragStart={onDragStart}
                  onDragOver={onDragOver}
                  onDrop={onDrop}
                  onDragLeave={onDragLeave}
                  className={'bg-gray-300 p-2 rounded-md'}
                >
                  {element.type === 'text' && (
                    <div>
                      {element.id} + {element.type}
                    </div>
                  )}
                  {element.type === 'image' && (
                    <div>
                      {element.id} + {element.type}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
