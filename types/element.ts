export interface Element {
  type: string;
  id: number;
  props: PropsElement;
}

export interface PropsElement {
  text: string;
  alert?: string;
}
