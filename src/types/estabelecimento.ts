export interface TEstabelecimento {
  id: number;
  name: TName;
  status: TStatus;
  localidade: TLocalidade[];
  secao: TSecao[];
  rota: TRota[];
  supervisor: TSupervisor[];
  site: TSite;
  vendas: TVendas[];
  premios: TPremios[];
  caixa: TCaixa[];
  liquido: TLiquido[];
  lancamento: TLancamento[];
  comissao: TComissao[];
  comissao_retida: TComissaoRetida;
  login: TLogin[];
}

export type TLogin = {
  id: number;
  name: string;
  password: string;
  equipment: string;
  serial: string;
  imagemUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
  establishmentId: number;
};

export type TComissaoRetida = boolean | null;

export type TComissao = {
  id: number;
  value: number;
  referenceDate: Date;
  createdAt: Date;
  establishmentId: number;
};

export type TLancamento = {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  referenceDate: Date;
  releaseDateOf: Date;
  value: number;
  establishmentId: number;
  type: string;
  paymentMethod: string;
  observation: string;
};

export type TLiquido = {
  id: number;
  value: number;
  referenceDate: Date;
  createdAt: Date;
  establishmentId: number;
};

export type TCaixa = {
  id: number;
  value: number;
  referenceDate: Date;
  createdAt: Date;
  establishmentId: number;
};

export type TPremios = {
  id: number;
  value: number;
  referenceDate: Date;
  createdAt: Date;
  establishmentId: number;
};

export type TVendas = {
  id: number;
  value: number;
  referenceDate: Date;
  createdAt: Date;
  establishmentId: number;
};

export type TSite = string | null;

export type TSupervisor = {
  id: number;
  name: string | null;
  createdAt: Date;
  establishmentId: number;
};
export type TRota = {
  id: number;
  name: string | null;
  createdAt: Date;
  establishmentId: number;
};

export type TSecao = {
  id: number;
  name: string | null;
  createdAt: Date;
  establishmentId: number;
};

export type TLocalidade = {
  id: number;
  name: string | null;
  createdAt: Date;
  establishmentId: number;
};
export type TStatus = string;
export type TName = string;
