'use client';

import Input from '@/components/input';
import { initialPosition } from '@/constants/initialData';
import { Element } from '@/types/element';
import { ElementPosition } from '@/types/elementPosition';
import { DragEvent, useEffect, useRef, useState } from 'react';

const AdminPage = () => {
  const [elements, setElements] = useState<Element[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0, dragging: '' });

  const [dragAndDrop, setDragAndDrop] = useState<ElementPosition>(initialPosition);

  const [selectedElement, setSelectedElement] = useState<Element | null>(null);

  const handleOnDrag = (e: DragEvent, elementType: string) => {
    (e.dataTransfer as DataTransfer).setData('elementType', elementType);
    setMousePosition({ ...mousePosition, dragging: elementType });
  };

  const handleOnDrop = (e: DragEvent) => {
    const elementType = (e.dataTransfer as DataTransfer).getData('elementType') as string;
    const newElement: Element = { type: elementType, id: new Date().getTime(), props: { text: '' } };

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

  const updateMousePosition = (e: MouseEvent) => {
    const rect = divRef.current?.getBoundingClientRect();

    if (rect) {
      // Kiểm tra nếu con trỏ chuột nằm trong ranh giới của div
      const withinBoundsX = e.clientX >= rect.left && e.clientX <= rect.right;
      const withinBoundsY = e.clientY >= rect.top && e.clientY <= rect.bottom;

      if (withinBoundsX && withinBoundsY) {
        setMousePosition({ x: e.clientX, y: e.clientY, dragging: mousePosition.dragging });
      }
    }
  };

  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.addEventListener('mousemove', updateMousePosition);

    // Cleanup listener on unmount
    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
    };
  }, []);

  const handleSave = () => {
    localStorage.setItem('data', JSON.stringify(elements));
  };

  const handleView = () => {
    window.open('/consumer', '_blank');
  };

  useEffect(() => {
    console.log('selectedElement', selectedElement);
    console.log('elements', elements);
  }, [elements, selectedElement]);

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
              onDragStart={(e) => handleOnDrag(e, 'button')}
            >
              button
            </div>
          </div>
        </div>
        <div
          ref={divRef}
          className="w-2/4 bg-gray-100 p-2 rounded-md"
          onDrop={handleOnDrop}
          onDragOver={handleOnDragOver}
        >
          <div>
            <button onClick={handleSave}>Save</button>
            <button onClick={handleView}>View</button>
          </div>
          <section>
            <ul>
              {elements.map((element, index) => (
                <li
                  key={index}
                  data-position={index}
                  draggable
                  //   onDragStart={onDragStart}
                  //   onDragOver={onDragOver}
                  //   onDrop={onDrop}
                  //   onDragLeave={onDragLeave}
                  className={'bg-gray-300 p-2 rounded-md'}
                >
                  {element.type === 'text' && (
                    <text
                      onClick={() => {
                        setSelectedElement(element);
                      }}
                    >
                      {element.id} + {element.type}
                    </text>
                  )}
                  {element.type === 'button' && (
                    <button
                      onClick={() => {
                        setSelectedElement(element);
                      }}
                    >
                      {element.id} + {element.type}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </section>
        </div>
        <div className="w-1/4">
          <div>
            <p>Mouse Position:</p>
            <p>X: {mousePosition.x}</p>
            <p>Y: {mousePosition.y}</p>
            <p>Dragging: {mousePosition.dragging}</p>
            <p>Instances: {elements.length}</p>
          </div>
          <div>
            {selectedElement && (
              <Input
                id="text"
                label="Add your text"
                type="text"
                placeholder="Text"
                onChange={(e) => {
                  const value = e.target.value;
                  setElements((prev) => {
                    const newElements = prev.map((element) => {
                      if (element.id === selectedElement.id) {
                        element.props.text = value;
                      }
                      return element;
                    });
                    return newElements;
                  });
                }}
              />
            )}
            {selectedElement?.type === 'button' && (
              <Input
                id="button"
                label="Add your message"
                type="text"
                placeholder="Text"
                onChange={(e) => {
                  const value = e.target.value;
                  setElements((prev) => {
                    const newElements = prev.map((element) => {
                      if (element.id === selectedElement.id) {
                        element.props.alert = value;
                      }
                      return element;
                    });
                    return newElements;
                  });
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
