"use client";
import { ModalLancamento, TableLancamentos } from "@/components/template";
import { FC, useContext } from "react";
import { FormLancamento } from "./FormLancamento";
import { LancamentoContext } from "@/context/lancamentoContext";

export const LayoutPage: FC = () => {
  const { lancamento } = useContext(LancamentoContext);
  return (
    <>
      <div className="flex flex-col gap-1">
        <div className="w-full">
          <FormLancamento />
          <ModalLancamento />
        </div>
      </div>
      <TableLancamentos data={lancamento} />
    </>
  );
};
