"use client";
import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui";
import { useParams, useRouter } from "next/navigation";
import { FetchHttpClient } from "@/adapter/FetchHttpClient";

interface SelectOption {
  id?: number;
  name?: string;
}

interface FilterableSelectProps {
  options: SelectOption[];
  placeholder?: string;
  type: "localidade" | "seção" | "rota" | "filiais" | "supervisor";
  onClick?: (e: React.MouseEvent<HTMLLIElement>) => void;
}

export const FilterableSelect: React.FC<FilterableSelectProps> = ({
  options,
  placeholder = "Type to filter...",
  type,
}) => {
  const [filter, setFilter] = useState<string>("");
  const [modalMenu, setModalMenu] = useState({ alertmenu: false });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [atributo, setAtributo] = useState({ id: 0, name: "" });
  const router = useRouter();

  const filteredOptions = options.filter((option) =>
    option.name?.toLowerCase().includes(filter.toLowerCase()),
  );
  const id = Number(useParams().slug);
  const handleModalMenu = () => {
    setModalMenu({ alertmenu: !modalMenu.alertmenu });
  };

  const updateAttribute = async (
    value: "localidade" | "seção" | "rota" | "filiais" | "supervisor" | "opção",
  ) => {
    setIsSubmitting(true);
    const strategy = {
      localidade: {
        id,
        localidade: {
          connect: { id: atributo.id },
        },
      },
      seção: {
        id,
        secao: {
          connect: { id: atributo.id },
        },
      },
      rota: {
        id,
        rota: {
          connect: { id: atributo.id },
        },
      },
      filiais: {
        id,
        filiais: {
          connect: { id: atributo.id },
        },
      },
      supervisor: {
        id,
        supervisor: {
          connect: { id: atributo.id },
        },
      },
      opção: {
        action: "tornar comissão retida",
        change: true,
        establishmentId: id,
      },
    };

    const strategyFilial = (
      value:
        | "localidade"
        | "seção"
        | "rota"
        | "filiais"
        | "supervisor"
        | "opção",
    ) => {
      switch (value) {
        case "opção":
          return "/comissao";
        case "filiais":
          return "/to-filial";
        default:
          return "";
      }
    };

    const fecth = new FetchHttpClient();
    try {
      const url = `/api/v1/management/establishments/update${strategyFilial(value)}`;
      await fecth.post(url, strategy[value]);
    } catch (error) {
      console.error("filtarable-select updatedAttribute", error);
    } finally {
      setIsSubmitting(false);
      router.refresh();
    }
  };

  return (
    <>
      <div tabIndex={0}>
        <input
          tabIndex={0}
          className="w-full p-2 bg-background rounded-sm  "
          type="text"
          placeholder={placeholder}
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        <ul tabIndex={0} className="overflow overflow-y-scroll h-60">
          {filteredOptions.map((option) => (
            <li
              tabIndex={0}
              className="p-2 hover:bg-foreground/20 cursor-pointer"
              key={option.id}
              value={option.id}
              onClick={() => {
                setAtributo({
                  id: Number(option.id),
                  name: option.name || "",
                });
                handleModalMenu();
              }}
            >
              {option.name}
            </li>
          ))}
        </ul>
      </div>
      <AlertDialog open={modalMenu.alertmenu}>
        <AlertDialogTrigger asChild></AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Definir no estabelecimento a {type} {atributo.name} ?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Essa ação pode lhe custar R$ 1,00
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleModalMenu}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                updateAttribute(type);
                handleModalMenu();
              }}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog open={isSubmitting}>
        <AlertDialogContent className="p-0 max-w-[400px]">
          <div className=" w-full p-6 animate-pulse flex place-items-center gap-16">
            <div className="w-8 h-8 border-4 border-l-transparent rounded-full animate-spin" />
            <AlertDialogHeader>
              <AlertDialogTitle>Realizando mudanças</AlertDialogTitle>
              <AlertDialogDescription>
                Aguarde até finalizar o processo
              </AlertDialogDescription>
            </AlertDialogHeader>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
