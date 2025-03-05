import {
  AuthenticationError,
  ValidationError,
  BusinessError,
  DatabaseError,
} from "@/domain/errors";
import { toast } from "@/components/ui";
import { ErrorPresenter } from "../ports/ErrorPresenter";

export class ErrorHandlerAdapter implements ErrorPresenter {
  constructor() {}

  handle(error: unknown): void {
    const errorMapping = {
      [AuthenticationError.name]: {
        title: "Erro de Autenticação",
      },
      [ValidationError.name]: {
        title: "Erro de Validação",
      },
      [BusinessError.name]: {
        title: "Erro de Negócio",
      },
      [DatabaseError.name]: {
        title: "Erro de Banco de Dados",
        description: "Ocorreu um erro ao salvar os dados",
      },
    };

    const errorType =
      error instanceof Error ? error.constructor.name : "Unknown";
    const errorConfig = errorMapping[errorType] || {
      title: "Erro Inesperado",
      description: "Ocorreu um erro ao processar sua solicitação",
    };
    console.log({ errorType });
    toast({
      title: errorConfig.title,
      description:
        errorConfig.description ||
        (error instanceof Error ? error.message : "Unknown error"),
      variant: "destructive",
    });

    // errorConfig.action?.();

    if (!errorMapping[errorType]) {
      console.error("Erro não tratado:", error);
    }
  }
}
