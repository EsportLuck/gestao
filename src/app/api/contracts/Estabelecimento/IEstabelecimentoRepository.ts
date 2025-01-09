import { Estabelecimento } from "@prisma/client";
export interface EstabelecimentoComLocalidadeSeção
  extends Omit<Estabelecimento, "id"> {
  localidadeIdParaConectar?: number;
  secaoIdParaConectar?: number;
  empresaIdParaConectar?: number;
}
export type EstabelecimentoSelecionado = Partial<Estabelecimento> & {
  localidade: { name: string | null } | null;
  secao: { name: string | null } | null;
  rota: { name: string | null } | null;
  supervisor: { name: string | null } | null;
  empresa: { name: string | null } | null;
  filiais: Array<{ id: number; name: string }> | null;
};

export interface IEstabelecimentoRepository {
  criar(data: EstabelecimentoComLocalidadeSeção): Promise<void>;
  editar(
    estabelecimentoId: number,
    data: Partial<Estabelecimento>,
  ): Promise<void>;
  encontrarPorId(estabelecimentoId: number): Promise<Estabelecimento | null>;
  encontrarPorNome(
    estabelecimentoNome: string,
  ): Promise<EstabelecimentoSelecionado | null>;
  encontrarMuitosEstabelecimentosPorSite(
    site: string,
  ): Promise<EstabelecimentoSelecionado[] | null>;
  encontrarMuitosEstabelecimentosPorEmpresa(
    site: string,
  ): Promise<EstabelecimentoSelecionado[] | null>;
  encontrarTodosOsEstabelecimentos(): Promise<Estabelecimento[]>;
}
