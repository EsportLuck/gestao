"use client";
import {
  TExtratoData,
  TExtratoAction,
  TExtratoContext,
  TResponse,
} from "@/types/extratoContext";
import React, {
  FC,
  ReactNode,
  createContext,
  useReducer,
  useState,
} from "react";

const defaultValues: TExtratoData = {
  Estabelecimentos: "Estabelecimentos",
  Localidade: "Localidade",
  Seção: "Seção",
  Supervisor: "Supervisor",
};

const myExtrato = {
  extratoData: defaultValues,
  setExtratoData: (action: TExtratoAction): void => {},
  response: null as TResponse | null,
  setResponse: (preState: React.SetStateAction<TResponse>) => {},
};

export const ExtratoContext = createContext<TExtratoContext>(myExtrato);

const extratoReduce = (
  state: TExtratoData,
  action: TExtratoAction,
): TExtratoData => {
  switch (action.type) {
    case "LOCALIDADE":
      return { ...state, Localidade: action.localidade };
    case "SECAO":
      return { ...state, Seção: action.seção };
    case "SUPERVISOR":
      return { ...state, Supervisor: action.supervisor };
    case "ESTABELECIMENTOS":
      return { ...state, Estabelecimentos: action.estabelecimentos };
    default:
      return state;
  }
};

export const ExtratoProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [extratoData, setExtratoData] = useReducer(
    extratoReduce,
    defaultValues,
  );
  const [response, setResponse] = useState<TResponse>(
    null as unknown as TResponse,
  );

  const contextValue: TExtratoContext = {
    extratoData,
    setExtratoData,
    response,
    setResponse,
  };

  return (
    <ExtratoContext.Provider value={contextValue}>
      {children}
    </ExtratoContext.Provider>
  );
};

export default ExtratoContext;
