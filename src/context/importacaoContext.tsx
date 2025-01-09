"use client";

import React, { FC, ReactNode, createContext, useState } from "react";

const defaultValues = false;

const Importando = {
  importando: defaultValues,
  setImportando: (newValue: boolean): void => {
    Importando.importando = newValue;
  },
};

export const ImportandoContext = createContext<typeof Importando>(Importando);

export const ImportacaoProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [importando, setImportando] = useState(defaultValues);

  const contextValue = {
    importando,
    setImportando,
  };

  return (
    <ImportandoContext.Provider value={contextValue}>
      {children}
    </ImportandoContext.Provider>
  );
};

export default ImportacaoProvider;
