import { ElementPosition } from '@/types/elementPosition';

export const initialPosition: ElementPosition = {
  draggedFrom: null,
  draggedTo: null,
  isDragging: false,
  originalOrder: [],
  updatedOrder: [],
};
