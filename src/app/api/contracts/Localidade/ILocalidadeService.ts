import { Localidade, Secao } from "@prisma/client";
import { TFile } from "@/app/api/services";
import { FormatterFunctions } from "@/app/api/v1/utils/strategy";
import { EstabelecimentoSelecionado } from "@/app/api/contracts";

export interface ILocalidadeService {
  criar(name: string, empresa: string): Promise<void>;
  editar(localidadeId: number, name: string): Promise<void>;
  encontrarPorId(localidadeId: number): Promise<Localidade | null>;
  encontrarPorNome(localidadeNome: string): Promise<Localidade | null>;
  encontrarTodasAsLocalidade(): Promise<
    | { localidade: Partial<Localidade[]>; error: false }
    | { localidade: []; error: true }
  >;
  encontrarTodasAsLocalidadesPorEmpresa(name: string): Promise<Localidade[]>;
}
