'use client';

import { MouseProps } from '@/hooks/useMouseXY';
import { Element } from '@/types/element';

interface MouseXYProps {
  mouseXY: MouseProps;
  mousePosition: {
    x: number;
    y: number;
    dragging: string;
  };
  elements: Element[];
  selectElement: Element;
}

const DisplayInfo = ({ mouseXY, mousePosition, elements, selectElement }: MouseXYProps) => {
  let configElement = null;
  if (selectElement) {
    configElement = JSON.stringify({
      type: selectElement.type,
      props:
        selectElement.type === 'text'
          ? { text: selectElement.props.text }
          : { text: selectElement.props.text, alert: selectElement.props.alert },
    });
  }

  return (
    <div className="p-4 border border-gray-300 rounded shadow">
      <p className="mb-2">Mouse Position:</p>
      <p className="mb-1">X: {mouseXY.x}</p>
      <p className="mb-1">Y: {mouseXY.y}</p>
      <p className="mb-1">Dragging: {mousePosition.dragging}</p>
      <p className="mb-1">Instances: {elements.length}</p>
      <p className="mb-1">Config: {configElement}</p>
    </div>
  );
};

export default DisplayInfo;
