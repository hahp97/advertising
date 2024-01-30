export interface Element {
  type: 'text' | 'button';
  id: number;
  props: PropsElement;
}

export interface PropsElement {
  text: string;
  alert?: string;
}
