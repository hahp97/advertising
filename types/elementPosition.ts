import { Element } from '@/types/element';

export type ElementPosition = {
  draggedFrom: number | null;
  draggedTo: number | null;
  isDragging: boolean;
  originalOrder: Element[];
  updatedOrder: Element[];
};
