import { AppError } from "./AppError";
import { HttpStatusCode } from "./HttpStatusCode";
export * from "./AppError";
export * from "./AuthenticationError";
export * from "./BusinessError";
export * from "./DatabaseError";
export * from "./HttpStatusCode";
export * from "./ValidationError";
interface IBaseError {
  message: string;
  statusCode: HttpStatusCode;
}

class BaseError extends Error {
  statusCode: HttpStatusCode;

  constructor({ statusCode, message }: IBaseError) {
    super();
    this.message = message;
    this.statusCode = statusCode || HttpStatusCode.INTERNAL_SERVER_ERROR;
  }
}

export class InternalServerError extends BaseError {
  constructor({ message, statusCode }: Partial<IBaseError>) {
    super({
      message: message || "Um erro interno não esperado aconteceu.",
      statusCode: statusCode || HttpStatusCode.INTERNAL_SERVER_ERROR,
    });
    this.name = "InternalServerError";
  }
}

export const isAppError = (error: unknown): error is AppError => {
  return error instanceof AppError;
};
