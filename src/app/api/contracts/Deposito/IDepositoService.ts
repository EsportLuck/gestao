export interface IDepositoService {
  usecase(
    id: string,
    status: string,
    establishmentId: string,
    referenceDate: string,
    type: string,
    value: number,
    status_action: string,
  ): Promise<{ sucess: boolean; message: string }>;
}
