export interface ErrorPresenter {
  handle(error: unknown): void;
}