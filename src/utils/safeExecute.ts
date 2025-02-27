import { isAppError, AppError } from "@/domain/errors";

export async function safeExecute<T>(
  fn: () => Promise<T>,
): Promise<[AppError | null, T | null]> {
  try {
    const result = await fn();
    return [null, result];
  } catch (error) {
    if (isAppError(error)) {
      return [error, null];
    }
    return [new AppError(String(error)), null];
  }
}
