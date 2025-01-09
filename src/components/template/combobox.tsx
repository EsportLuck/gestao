"use client";

import * as React from "react";
import { Search } from "lucide-react";
import {
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Button,
} from "@/components/ui";
import { TEstabelecimento } from "@/types/estabelecimento";
// import { findSimilarStrings } from "@/utils/approximationAlgorithm";

interface ICombobox {
  estabelecimentos: TEstabelecimento[];
}

export const Combobox: React.FC<ICombobox> = ({ estabelecimentos }) => {
  const [open, setOpen] = React.useState(false);
  const [controller, setController] = React.useState({
    value: "",
    filter: "",
    default: "",
    estabelecimentos: estabelecimentos,
  });
  const handleFiltroChange = (e: { target: { value: string } }) => {
    setController({
      ...controller,
      default: e.target.value.toLowerCase(),
    });
  };
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.key === "Enter") {
      setOpen(false);
      setController({
        ...controller,
        default: e.currentTarget.getAttribute("data-value") as string,
      });
    }
  };

  React.useEffect(() => {
    setController({
      ...controller,
      estabelecimentos: estabelecimentos,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [estabelecimentos]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[300px] justify-between"
        >
          {controller.value
            ? controller.estabelecimentos.find(
                (estabelecimento: TEstabelecimento) =>
                  estabelecimento.name === controller.value,
              )?.name
            : "Selecione um Estabelecimento..."}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0 ">
        <div className="flex relative">
          <Search className="flex absolute top-2 left-2" />
          <Input
            className="pl-10"
            type="text"
            placeholder="Filtre o estabelecimento..."
            onChange={handleFiltroChange}
          />
        </div>
        {controller.estabelecimentos ? (
          controller.estabelecimentos
            .filter((estabelecimento) =>
              estabelecimento.name
                .toLocaleLowerCase()
                .includes(controller.default),
            )
            .map((estabelecimento) => (
              <div
                tabIndex={0}
                key={estabelecimento.name}
                data-={estabelecimento.name}
                className="p-2 cursor-pointer dark:hover:brightness-150 hover:brightness-90 bg-popover mt-2"
                onKeyDown={handleKeyPress}
                onClick={() => {
                  setOpen(false);
                  setController({
                    ...controller,
                    value: estabelecimento.name,
                  });
                }}
              >
                {estabelecimento.name}
              </div>
            ))
        ) : (
          <div
            tabIndex={0}
            className="p-2 cursor-pointer dark:hover:brightness-150 hover:brightness-90 bg-popover mt-2"
            onClick={() => {
              setOpen(false);
            }}
          >
            {"Não há estabelecimentos"}
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};
