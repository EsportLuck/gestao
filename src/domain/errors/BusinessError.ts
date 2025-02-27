import { AppError } from "./AppError";
import { HttpStatusCode } from "../enum/HttpStatusCode";

export class BusinessError extends AppError {
  constructor(message: string) {
    super(message, HttpStatusCode.UNPROCESSABLE_ENTITY);
    this.name = "BusinessError";
  }
}

export class InvalidOperationError extends AppError {
  constructor(message: string) {
    super(message, HttpStatusCode.UNPROCESSABLE_ENTITY);
    this.name = "InvalidOperationError";
  }
}

export class InsufficientFundsError extends AppError {
  constructor() {
    super("Saldo insuficiente", HttpStatusCode.UNPROCESSABLE_ENTITY);
    this.name = "InsufficientFundsError";
  }
}
