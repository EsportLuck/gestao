import { AppError } from "./AppError";

export class AuthenticationError extends AppError {
  constructor(message = "Não autorizado") {
    super(message, 401);
    this.name = "AuthenticationError";
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Acesso negado") {
    super(message, 403);
    this.name = "ForbiddenError";
  }
}
