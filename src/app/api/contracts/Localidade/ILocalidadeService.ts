import { Localidade } from "@prisma/client";

export interface ILocalidadeService {
  criar(name: string, empresa: string): Promise<void>;
  editar(localidadeId: number, name: string): Promise<void>;
  encontrarPorId(localidadeId: number): Promise<Localidade | null>;
  encontrarPorNome(localidadeNome: string): Promise<Localidade | null>;
  encontrarTodasAsLocalidade(): Promise<
    | { localidades: Partial<Localidade[]>; error: false }
    | { localidades: []; error: true }
  >;
  encontrarTodasAsLocalidadesPorEmpresa(name: string): Promise<Localidade[]>;
}
