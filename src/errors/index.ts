interface IBaseError {
  message: string;
  statusCode: number;
}

class BaseError extends Error {
  statusCode: number;
  constructor({ statusCode, message }: IBaseError) {
    super();
    this.message = message;
    this.statusCode = statusCode || 500;
  }
}

export class InternalServerError extends BaseError {
  constructor({ message, statusCode }: IBaseError) {
    super({
      message: message || "Um erro interno não esperado aconteceu.",
      statusCode: statusCode || 500,
    });
  }
}
