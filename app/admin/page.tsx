'use client';

import Button from '@/components/button';
import ConfigForm from '@/components/configForm';
import DisplayInfo from '@/components/displayInfo';
import Label from '@/components/paragraph';
import ToastMessage from '@/components/toast';
import useLocalStorage from '@/hooks/useLocalStorage';
import useMouseXY from '@/hooks/useMouseXY';
import useToast from '@/hooks/useToast';
import { Element } from '@/types/element';
import { ChangeEvent, DragEvent, RefObject, useCallback, useRef, useState } from 'react';

const AdminPage = () => {
  const [valueElement, setValueElement] = useLocalStorage('data', []);

  const [elements, setElements] = useState<Element[]>(valueElement || []);
  const [config, setConfig] = useState<boolean>(false);

  const [storeUndo, setStoreUndo] = useState<Element[]>([]);
  const [storeRedo, setStoreRedo] = useState<Element[]>([]);

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0, dragging: '' });

  const [selectedElement, setSelectedElement] = useState<Element | null>(null);

  const myElementRef = useRef<HTMLElement>(null);
  const mouseXY = useMouseXY(myElementRef);

  const { showToast, toastProps } = useToast();

  const handleOnDrag = (e: DragEvent, elementType: string) => {
    (e.dataTransfer as DataTransfer).setData('elementType', elementType);
    setMousePosition({ ...mousePosition, dragging: elementType });
  };

  const handleOnDrop = (e: DragEvent) => {
    const elementType = (e.dataTransfer as DataTransfer).getData('elementType') as 'text' | 'button';

    const newElement: Element = {
      type: elementType,
      id: new Date().getTime(),
      props: { text: `${elementType === 'text' ? 'Paragraph' : 'Button'}` },
    };

    setElements([...elements, newElement]);
    setStoreUndo([...storeUndo, newElement]);

    setStoreRedo([]);
  };

  const handleOnDragOver = (e: DragEvent) => {
    e.preventDefault();
  };

  const handleSave = () => {
    setValueElement(elements);

    showToast('Save successfully');

    setStoreRedo([]);
    setStoreUndo([]);
  };

  const handleView = () => {
    const dataView = valueElement;

    if (!dataView) {
      return;
    }

    const isElementChanged = JSON.stringify(dataView) !== JSON.stringify(elements);

    if (isElementChanged) {
      const shouldSave = window.confirm(
        'Have a new change, do you want to save before view? By click OK to save, Cancel to view',
      );
      if (shouldSave) {
        handleSave();
        return;
      }
    }

    window.open('/consumer', '_blank');
  };

  const handleExport = () => {
    const dataView = valueElement;
    if (!dataView) {
      return;
    }

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
    if (storeUndo.length > 0) {
      const lastElement = storeUndo[storeUndo.length - 1];
      setStoreUndo(storeUndo.slice(0, storeUndo.length - 1));
      if (elements.length > 0) {
        const poppedElement = elements.pop();
        if (poppedElement) {
          setElements(poppedElement ? [...elements] : [...elements, lastElement]);
        }
      }
      setStoreRedo([...storeRedo, lastElement]);
    }
  };

  const handleRedo = () => {
    if (storeRedo.length > 0) {
      const lastElement = storeRedo[storeRedo.length - 1];
      setStoreRedo(storeRedo.slice(0, storeRedo.length - 1));
      setElements([...elements, lastElement]);
      setStoreUndo([...storeUndo, lastElement]);
    }
  };

  const handleConfigElement = (element: Element, e: ChangeEvent<HTMLInputElement>) => {
    setSelectedElement(element);
    const value = e.target.value;

    setElements((prev) => {
      const newElements = prev.map((item) => {
        if (item.id === element.id) {
          item.props.text = value.length > 0 ? value : 'Paragraph';
        }

        return item;
      });

      setValueElement(newElements);

      return newElements;
    });
  };

  const isElementChange = useCallback(
    (elements: Element[], valueElement: Element[]) => {
      const isElementChanged = JSON.stringify(valueElement) !== JSON.stringify(elements);
      return isElementChanged;
    },
    [elements],
  );

  return (
    <div>
      <div className="flex h-[100vh]">
        <div className="w-1/4 flex flex-col justify-between">
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
          <div>
            <DisplayInfo
              selectElement={selectedElement as Element}
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
              disabled={!isElementChange(elements, valueElement) || elements.length === 0}
              onClick={handleSave}
            />
            <Button
              label="View"
              disabled={valueElement?.length === 0 || elements.length === 0}
              onClick={handleView}
            />
            <Button
              label="Export"
              disabled={valueElement?.length === 0 || elements.length === 0}
              onClick={handleExport}
            />
            <Button
              label="Import"
              onClick={handleImport}
            />
            <Button
              label="Undo"
              disabled={storeUndo.length === 0}
              onClick={handleUndo}
            />
            <Button
              label="Redo"
              disabled={storeRedo.length === 0}
              onClick={handleRedo}
            />
          </div>

          <section>
            <ul className="flex flex-col my-10 items-center">
              {elements.map((element, index) => (
                <li
                  key={index}
                  data-position={index}
                >
                  {element.type === 'text' && (
                    <div
                      className={'p-2 rounded-md hover:bg-gray-300 mb-2'}
                      onClick={() => {
                        setConfig(false);
                        setSelectedElement(element);
                      }}
                      onBlur={() => setSelectedElement(null)}
                    >
                      <Label
                        initialContent={element.props.text || 'Paragraph'}
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
          {selectedElement?.type === 'text' && (
            <div className="p-4 border rounded-md shadow-md">
              <p>This is a paraphrase content. You can customize and add your own meaningful.</p>
            </div>
          )}
          {selectedElement?.type === 'button' && (
            <div className="p-4 border rounded-md shadow-md mb-5">
              <text className="text-blue-500 cursor-pointer underline">Configure button:</text>
            </div>
          )}
          {config && (
            <ConfigForm
              selectedElement={selectedElement as Element}
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

                  setValueElement(newElements);

                  return newElements;
                });
                setSelectedElement(null);
              }}
              inputTitle="Input Button"
              initialData={{
                titleElement: selectedElement?.props.text || '',
                alertMessageBtn: selectedElement?.props.alert || '',
              }}
              type={selectedElement?.type as 'text' | 'button'}
            />
          )}
        </div>
      </div>
      <ToastMessage {...toastProps} />
    </div>
  );
};

export default AdminPage;
