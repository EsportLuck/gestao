import { AppError } from "./AppError";

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400);
    this.name = "ValidationError";
  }
}

export class MissingFieldError extends ValidationError {
  constructor(field: string) {
    super(`Campo obrigatório: ${field}`);
  }
}

export class InvalidFormatError extends ValidationError {
  constructor(field: string, format: string) {
    super(`Formato inválido para ${field}. Formato esperado: ${format}`);
  }
}
