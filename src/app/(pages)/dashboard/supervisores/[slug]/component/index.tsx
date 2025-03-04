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
} from "lucide-react";
import { DropDownMenuItens, TMessage } from "./drop-down-menu-itens";
import { useState } from "react";
import { Localidade, Secao, Rota } from "@prisma/client";
interface IAction {
  localidade?: Array<Partial<Localidade>>;
  secao?: Array<Partial<Secao>>;
  rota?: Array<Partial<Rota>>;
}
export const Action: React.FC<IAction> = ({ localidade, secao, rota }) => {
  const options = [
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
  ];

  const [stateOptions] = useState(options);

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
                      items={option.items}
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
