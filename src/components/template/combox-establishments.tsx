"use client";

import * as React from "react";
import { ChevronsUpDown, Search } from "lucide-react";

import { Button } from "@/components/ui/button";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui";
import { TEstabelecimento } from "@/types/estabelecimento";

interface ICombobox {
  establishments: Partial<TEstabelecimento>[];
  onValueChange?: (value: string) => void;
}

export function ComboboxEstablishment({
  establishments,
  onValueChange,
}: ICombobox) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  const [comboxItens, setComboxItens] = React.useState(establishments);

  React.useEffect(() => {
    if (onValueChange) {
      onValueChange(value);
    }
  }, [value, onValueChange]);

  React.useEffect(() => {
    if (establishments.length < 1) return;
    setComboxItens(establishments);
  }, [establishments]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.toLowerCase();
    setComboxItens(
      establishments.filter((item) =>
        item?.name?.toLowerCase().includes(inputValue),
      ),
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setComboxItens(establishments);
      setOpen(false);
    } else if (e.key === "Enter") {
      const inputValue = (e.target as HTMLInputElement).value.toLowerCase();
      const selectedItem = comboxItens.filter((item) =>
        item?.name?.toLowerCase().includes(inputValue),
      );
      setValue(selectedItem[0]?.name || "");
      setOpen(false);
      setComboxItens(establishments);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[240px] justify-between overflow-hidden text-muted-foreground"
        >
          {value ? JSON.parse(value).name : "Escolha um Estabelecimento"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[240px] p-0">
        <label
          id="input-box"
          className="px-2 flex place-items-center outline-offset-0 focus:outline focus:outline-2 outline-slate-50 rounded-sm"
          htmlFor="input-box"
        >
          <Search size={19} className="text-muted-foreground" />
          <input
            id="input-box"
            className="w-full bg-transparent rounded-sm py-1 px-2 focus:outline-none"
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
          />
        </label>
        <ul className="max-h-52 overflow-auto">
          {comboxItens.map((item) =>
            item && item.name ? (
              <li
                className="p-2 rounded-sm text-sm outline-offset-0 focus:outline focus:outline-2 outline-slate-50 hover:bg-accent/90 "
                tabIndex={0}
                key={item.name}
                onClick={() => {
                  setValue(JSON.stringify(item) || "");
                  setOpen(false);
                }}
                onKeyDownCapture={(e) => {
                  if (e.key === "Enter") {
                    setValue(JSON.stringify(item) || "");
                    setOpen(false);
                  }
                }}
              >
                {item.name}
              </li>
            ) : null,
          )}
        </ul>
      </PopoverContent>
    </Popover>
  );
}
