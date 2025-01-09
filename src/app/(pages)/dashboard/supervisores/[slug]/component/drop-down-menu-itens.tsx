import { DropdownMenuItem } from "@/components/ui";
import { MenuDefinicaoSupervisor } from "./menu-de-definicao-do-supervisor";

export type TMessage = "localidade" | "seção";

interface DropdownMenuItemData {
  id: string;
  name: string;
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
  return (
    <MenuDefinicaoSupervisor options={items} type={type} onClick={onClick} />
  );
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
