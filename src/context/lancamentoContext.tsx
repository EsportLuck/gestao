"use client";

import React, { FC, ReactNode, createContext, useState } from "react";
import { LancamentosTable } from "@/components/template/table-lancamentos/columns";

let defaultValues: never[] | LancamentosTable[] = [];

let Lancamento = {
  lancamento: defaultValues,
  setLancamento: (newValue: never[] | LancamentosTable[]): void => {
    Lancamento.lancamento = newValue;
  },
};

export const LancamentoContext = createContext<typeof Lancamento>(Lancamento);

export const LancamentoProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [lancamento, setLancamento] = useState(defaultValues);

  const contextValue = {
    lancamento,
    setLancamento,
  };

  return (
    <LancamentoContext.Provider value={contextValue}>
      {children}
    </LancamentoContext.Provider>
  );
};

export default LancamentoProvider;
