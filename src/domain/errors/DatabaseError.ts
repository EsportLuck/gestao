import { AppError } from "./AppError";
import { HttpStatusCode } from "../enum/HttpStatusCode";

export class DatabaseError extends AppError {
  constructor(message: string) {
    super(message, HttpStatusCode.INTERNAL_SERVER_ERROR);
    this.name = "DatabaseError";
  }
}

export class RecordNotFoundError extends AppError {
  constructor(entity: string) {
    super(`${entity} não encontrado`, HttpStatusCode.NOT_FOUND);
    this.name = "RecordNotFoundError";
  }
}

export class DuplicateRecordError extends AppError {
  constructor(entity: string) {
    super(`${entity} já existe`, HttpStatusCode.CONFLICT);
    this.name = "DuplicateRecordError";
  }
}
