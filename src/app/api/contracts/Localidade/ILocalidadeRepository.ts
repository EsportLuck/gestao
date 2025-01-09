import { Localidade } from "@prisma/client";

export interface ILocalidadeRepository {
  criar(name: string, empresa: number | undefined): Promise<void>;
  editar(localidadeId: number, name: string): Promise<void>;
  encontrarPorId(localidadeId: number): Promise<Localidade | null>;
  encontrarPorNome(localidadeNome: string): Promise<Localidade | null>;
  encontrarTodasAsLocalidade(): Promise<Localidade[] | []>;
  encontrarTodasAsLocalidadesPorEmpresa(name: string): Promise<Localidade[]>;
}
