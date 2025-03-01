"use client";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui";
import { DropdownMenuGroup } from "@radix-ui/react-dropdown-menu";
import {
  Settings,
  CircuitBoard,
  GitPullRequestDraft,
  GitPullRequestCreateArrow,
  Cable,
  UserRound,
  Blinds,
} from "lucide-react";
import {
  DropdownMenuItemData,
  DropDownMenuItens,
  TMessage,
} from "./drop-down-menu-itens";
import { useEffect, useMemo, useState } from "react";
interface MenuOption {
  icon: React.ReactNode;
  title: string;
  items: Array<{ id?: number | string; name?: string }> | undefined;
  message: string;
  modal: boolean;
}
interface IAction {
  localidade?: Array<{
    id?: number;
    name?: string;
  }>;
  secao?: Array<{
    id?: number;
    name?: string;
  }>;
  rota?: Array<{
    id?: number;
    name?: string;
  }>;
  filiais?: Array<{
    id?: number;
    name?: string;
  }>;
  supervisor?: Array<{
    id?: number;
    name?: string;
  }>;
}
export const Action: React.FC<IAction> = ({
  localidade,
  secao,
  rota,
  filiais,
  supervisor,
}) => {
  const [stateOptions, setStateOptions] = useState<MenuOption[]>([]);
  const options = useMemo(
    () => [
      {
        icon: <CircuitBoard className="mr-2 h-4 w-4" />,
        title: "Definir Localidade",
        items: localidade,
        message: "localidade",
        modal: false,
      },
      {
        icon: <GitPullRequestDraft className="mr-2 h-4 w-4" />,
        title: "Definir Seção",
        items: secao,
        message: "seção",
        modal: false,
      },
      {
        icon: <GitPullRequestCreateArrow className="mr-2 h-4 w-4" />,
        title: "Definir Rota",
        items: rota,
        message: "rota",
        modal: false,
      },
      {
        icon: <Cable className="mr-2 h-4 w-4" />,
        title: "Definir Filial",
        items: filiais,
        message: "filiais",
        modal: false,
      },
      {
        icon: <UserRound className="mr-2 h-4 w-4" />,
        title: "Definir Supervisor",
        items: supervisor,
        message: "supervisor",
        modal: false,
      },
      {
        icon: <Blinds className="mr-2 h-4 w-4" />,
        title: "Definir Comissão Retida",
        items: [{ id: "1", name: "tornar comissão retida" }],
        message: "opção",
        modal: false,
      },
    ],
    [filiais, localidade, rota, secao, supervisor],
  );

  useEffect(() => {
    setStateOptions(options);
  }, [options]);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-12 w-12 p-0">
          <span className="sr-only">Open menu</span>
          <Settings size={36} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Configurações</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {stateOptions.map((option) => {
            return (
              <DropdownMenuSub key={option.message}>
                <DropdownMenuSubTrigger>
                  {option.icon}
                  {option.title}
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <DropDownMenuItens
                      items={option.items as DropdownMenuItemData[]}
                      emptyMessage={option.message as TMessage}
                    />
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            );
          })}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
