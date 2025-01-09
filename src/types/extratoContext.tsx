import { Dispatch } from "react";

export type TData = {
  name: string;
  caixa: [{ value: number }];
  comissao: [{ value: number }];
  deposito: [{ value: number }];
  sangria: [{ value: number }];
  liquido: [{ value: number }];
  vendas: [{ value: number }];
};
export type TResponse = {
  data: Array<TData>;
};
export type TExtratoData = {
  Localidade: string;
  Seção: string;
  Supervisor: string;
  Estabelecimentos: string;
};

export type TExtratoAction =
  | { type: "LOCALIDADE"; localidade: string }
  | { type: "SECAO"; seção: string }
  | { type: "SUPERVISOR"; supervisor: string }
  | { type: "ESTABELECIMENTOS"; estabelecimentos: string };

export type TExtratoContext = {
  extratoData: TExtratoData;
  setExtratoData: Dispatch<TExtratoAction>;
  response: TResponse | null;
  setResponse: React.Dispatch<React.SetStateAction<TResponse>>;
};
