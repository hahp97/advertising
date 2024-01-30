'use client';

import Button from '@/components/button';
import ConfigForm from '@/components/configForm';
import DisplayInfo from '@/components/displayInfo';
import Label from '@/components/paragraph';
import { initialPosition } from '@/constants/initialData';
import useMouseXY from '@/hooks/useMouseXY';
import { Element } from '@/types/element';
import { ElementPosition } from '@/types/elementPosition';
import { ChangeEvent, DragEvent, RefObject, useEffect, useRef, useState } from 'react';

const AdminPage = () => {
  const [elements, setElements] = useState<Element[]>([]);
  const [history, setHistory] = useState<Element[]>([]);
  const [config, setConfig] = useState<boolean>(false);

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0, dragging: '' });

  const [dragAndDrop, setDragAndDrop] = useState<ElementPosition>(initialPosition);

  const [selectedElement, setSelectedElement] = useState<Element | null>(null);

  const myElementRef = useRef<HTMLElement>(null);
  const mouseXY = useMouseXY(myElementRef);

  const handleOnDrag = (e: DragEvent, elementType: string) => {
    (e.dataTransfer as DataTransfer).setData('elementType', elementType);
    setMousePosition({ ...mousePosition, dragging: elementType });
  };

  const handleOnDrop = (e: DragEvent) => {
    const elementType = (e.dataTransfer as DataTransfer).getData('elementType') as 'text' | 'button';
    const newElement: Element = { type: elementType, id: new Date().getTime(), props: { text: '' } };

    setElements([...elements, newElement]);
    setHistory([...history, newElement]);
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

  const handleSave = () => {
    localStorage.setItem('data', JSON.stringify(elements));
  };

  const handleView = () => {
    const data = localStorage.getItem('data');

    if (!data) {
      return;
    }

    const dataView = JSON.parse(data);
    const isElementChanged = JSON.stringify(dataView) !== JSON.stringify(elements);

    if (isElementChanged) {
      const shouldSave = window.confirm('Have a new change, do you want to save before view?');
      if (shouldSave) {
        handleSave();
        return;
      }
    }

    window.open('/consumer', '_blank');
  };

  const handleExport = () => {
    const data = window?.localStorage.getItem('data');
    if (!data) {
      return;
    }

    const dataView = JSON.parse(data);

    const dataExport = dataView.map((element: Element) => {
      if (element.type === 'text') {
        return {
          id: element.id,
          type: element.type,
          props: {
            text: element.props.text,
          },
        };
      }

      if (element.type === 'button') {
        return {
          id: element.id,
          type: element.type,
          props: {
            text: element.props.text,
            alert: element.props.alert,
          },
        };
      }
    });

    const dataExportString = JSON.stringify(dataExport);

    const blob = new Blob([dataExportString], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.json';
    a.click();
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';

    input.onchange = (e: any) => {
      const file = e.target.files[0];

      const reader = new FileReader();
      reader.readAsText(file, 'UTF-8');

      reader.onload = (readerEvent) => {
        const content = readerEvent.target?.result;
        if (typeof content === 'string') {
          const dataImport = JSON.parse(content);

          const dataView = dataImport.map((element: Element) => {
            if (element.type === 'text') {
              return {
                type: element.type,
                id: element.id || new Date().getTime(),
                props: {
                  text: element.props.text,
                },
              };
            }

            if (element.type === 'button') {
              return {
                type: element.type,
                id: element.id || new Date().getTime(),
                props: {
                  text: element.props.text,
                  alert: element.props.alert,
                },
              };
            }
          });

          setElements(dataView);
        }
      };
    };

    input.click();
  };

  const handleUndo = () => {
    setHistory(history.slice(0, history.length - 1));

    setElements(history.slice(0, history.length - 1));
  };

  const handleConfigElement = (element: Element, e: ChangeEvent<HTMLInputElement>) => {
    setSelectedElement(element);
    const value = e.target.value;
    setElements((prev) => {
      const newElements = prev.map((item) => {
        if (item.id === element.id) {
          item.props.text = value;
        }
        return item;
      });
      return newElements;
    });
  };

  useEffect(() => {
    console.log('history', history);
  }, [history]);

  return (
    <div>
      <div className="flex h-[100vh]">
        <div className="w-1/4 flex flex-col">
          <div className="bg-gray-200 p-4 rounded-md space-y-4">
            <div
              className="bg-gray-300 p-3 rounded-md cursor-move relative"
              draggable="true"
              onDragStart={(e) => handleOnDrag(e, 'text')}
            >
              <p className="text-gray-800">Text</p>
              <div className="absolute bottom-0 right-0 p-1 bg-gray-500 text-white text-xs rounded-bl-md">
                Drag me to add Paragraph
              </div>
            </div>
            <div
              className="bg-gray-300 p-3 rounded-md cursor-move relative"
              draggable="true"
              onDragStart={(e) => handleOnDrag(e, 'button')}
            >
              <p className="text-gray-800">Button</p>
              <div className="absolute bottom-0 right-0 p-1 bg-gray-500 text-white text-xs rounded-bl-md">
                Drag me to add a button
              </div>
            </div>
          </div>
          <div className="bottom-0 flex-end">
            <DisplayInfo
              mouseXY={mouseXY}
              mousePosition={mousePosition}
              elements={elements}
            />
          </div>
        </div>
        <div
          ref={myElementRef as RefObject<HTMLDivElement>}
          className="flex flex-col w-2/4 bg-gray-100 p-2 rounded-md"
          onDrop={handleOnDrop}
          onDragOver={handleOnDragOver}
          id="drop-area"
        >
          <div className="flex items-center justify-center space-x-3 py-4 rounded-lg mx-auto px-6 bg-white ring-1 ring-slate-900/5 shadow-lg">
            <Button
              label="Save"
              disabled={elements.length === 0}
              onClick={handleSave}
            />
            <Button
              label="View"
              disabled={window?.localStorage.getItem('data') === null}
              onClick={handleView}
            />
            <Button
              label="Export"
              onClick={handleExport}
            />
            <Button
              label="Import"
              onClick={handleImport}
            />
            <Button
              label="Undo"
              onClick={handleUndo}
            />
            <Button
              label="Redo"
              onClick={handleUndo}
            />
          </div>

          <section>
            <ul className="flex flex-col my-10 items-center">
              {elements.map((element, index) => (
                <li
                  key={index}
                  data-position={index}
                  draggable
                  onDragStart={onDragStart}
                  onDragOver={onDragOver}
                  onDrop={onDrop}
                  onDragLeave={onDragLeave}
                >
                  {element.type === 'text' && (
                    <div className={'p-2 rounded-md hover:bg-gray-300 mb-2'}>
                      <Label
                        initialContent="Paragraph"
                        onChange={(e) => handleConfigElement(element, e)}
                      />
                    </div>
                  )}
                  {element.type === 'button' && (
                    <button
                      className={'bg-gray-200 p-2 rounded-md hover:bg-gray-300 mb-2'}
                      onClick={() => {
                        setSelectedElement(element);
                        setConfig(true);
                      }}
                    >
                      {element.props.text || 'Button'}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </section>
        </div>
        <div className="w-1/4">
          {config && (
            <ConfigForm
              onSave={(data) => {
                setConfig(false);
                setElements((prev) => {
                  const newElements = prev.map((element) => {
                    if (element.id === selectedElement?.id) {
                      element.props.text = data.titleElement;
                      element.props.alert = data.alertMessageBtn;
                    }
                    return element;
                  });
                  return newElements;
                });
              }}
              inputTitle="Input Button"
              initialData={{
                titleElement: selectedElement?.props.text || '',
                alertMessageBtn: selectedElement?.props.alert || '',
              }}
              type={selectedElement?.type as 'text' | 'button'}
            />
          )}

          {/* <div>
            {selectedElement?.type === 'button' && (
              <Input
                id="button"
                label="Add your message"
                type="text"
                placeholder="Text"
                onBlur={(e) => {
                  const value = e.target.value;
                  setHistory((prev) => [
                    ...prev,
                    { ...selectedElement, props: { ...selectedElement.props, alert: value } },
                  ]);
                }}
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
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
