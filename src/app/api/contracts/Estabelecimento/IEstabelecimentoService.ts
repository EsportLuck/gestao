import { Estabelecimento } from "@prisma/client";
import {
  EstabelecimentoComLocalidadeSeção,
  EstabelecimentoSelecionado,
} from ".";

export interface IEstabelecimentoService {
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
  encontrarTodosOsEstabelecimentos(): Promise<
    | { estabelecimento: Partial<Estabelecimento[]>; error: false }
    | { estabelecimento: []; error: true }
  >;
}
