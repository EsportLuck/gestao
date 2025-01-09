"use client";

import React, { FC, ReactNode, createContext, useState } from "react";

const defaultValues = false;

const modal = {
  open: defaultValues,
  setOpen: (newValue: boolean): void => {
    modal.open = newValue;
  },
};

export const modalEstabelecimentosContext = createContext<typeof modal>(modal);

export const ModalProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [open, setOpen] = useState(defaultValues);

  const contextValue = {
    open,
    setOpen,
  };

  return (
    <modalEstabelecimentosContext.Provider value={contextValue}>
      {children}
    </modalEstabelecimentosContext.Provider>
  );
};

export default ModalProvider;
