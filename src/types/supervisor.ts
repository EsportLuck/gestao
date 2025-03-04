export interface SelectOption {
  id: string;
  name: string;
}

export interface SupervisorAttribute {
  id: number;
  name: string;
}

export type AttributeType = 'localidade' | 'seção';

export interface SupervisorDetailProps {
  id: number;
  title: string;
  value: string | SupervisorAttribute[];
  onDelete?: (attributeId: number) => Promise<void>;
}