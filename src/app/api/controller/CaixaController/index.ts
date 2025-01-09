import { encontrarCaixaEmPeridoDeTempo } from "./encontrarCaixaEmPeridoDeTempo";
import { criarCaixa } from "./criarCaixa";
import { atualizarCaixa } from "./atualizarCaixa";
import { verificarSeEMatriz } from "./verificarSeEMatriz";
import { encontrarCaixaDaMatriz } from "./encontrarCaixaDaMatriz";

export class CaixaController {
  async verificarSeEMatriz({ id }: { id: number }) {
    return verificarSeEMatriz({ id });
  }

  async encontrarCaixaDaMatriz({
    id,
    gte,
    lte,
    value_search,
  }: {
    id: number | null;
    gte: Date;
    lte: Date;
    value_search: string;
  }) {
    if (!id) return null;
    return encontrarCaixaDaMatriz({ id, gte, lte, value_search });
  }

  async encontrarCaixaEmPeridoDeTempo(
    establishmentId: number,
    gte: Date,
    lte: Date,
  ) {
    return encontrarCaixaEmPeridoDeTempo(establishmentId, gte, lte);
  }

  async criarCaixa(data: {
    total: number;
    referenceDate: Date;
    site: string;
    value_search: string;
    establishmentId: number;
    tipo_caixa: string;
    idImportacao: number;
    liquido: number;
  }) {
    return criarCaixa(data);
  }

  async atualizarCaixa(
    id: number | undefined,
    total: number,
    value_search: string,
    searchTotal: number,
  ) {
    return atualizarCaixa(id, total, value_search, searchTotal);
  }
}
