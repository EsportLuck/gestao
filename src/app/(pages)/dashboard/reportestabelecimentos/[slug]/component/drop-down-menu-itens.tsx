import { FilterableSelect } from "@/components/template";
import { DropdownMenuItem } from "@/components/ui";

export type TMessage = "localidade" | "rota" | "seção" | "filiais";

export interface DropdownMenuItemData {
  id?: number;
  name?: string;
}

interface IDropDownMenuItens {
  items?: DropdownMenuItemData[];
  emptyMessage: TMessage;
  onClick?: (e: React.MouseEvent<HTMLLIElement>) => void;
}

export const DropDownMenuItens: React.FC<IDropDownMenuItens> = ({
  items,
  emptyMessage,
  onClick,
}) => {
  return renderStrategy(items, emptyMessage, onClick);
};

const renderMenuItem = (
  items: DropdownMenuItemData[],
  type: TMessage,
  onClick?: (e: React.MouseEvent<HTMLLIElement>) => void,
) => {
  return <FilterableSelect options={items} type={type} onClick={onClick} />;
};
const renderEmptyMessage = (message: string) => {
  return <DropdownMenuItem>{`Registre uma ${message}`}</DropdownMenuItem>;
};

const renderStrategy = (
  items: DropdownMenuItemData[] | undefined,
  message: TMessage,
  onClick?: (e: React.MouseEvent<HTMLLIElement>) => void,
) => {
  return items && items.length > 0
    ? renderMenuItem(items, message, onClick)
    : renderEmptyMessage(message);
};
