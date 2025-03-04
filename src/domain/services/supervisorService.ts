import { FetchHttpClient } from "@/adapter/FetchHttpClient";

export class SupervisorService {
  private client: FetchHttpClient;
  private baseUrl = "/api/v1/management/supervisores";

  constructor() {
    this.client = new FetchHttpClient();
  }

  async updateSupervisor(id: number, data: any) {
    return this.client.patch(`${this.baseUrl}/update`, data);
  }

  async editSupervisorName(data: {
    novoNomeDoSupevisor: string;
    nomeDoSupervisor: string;
  }) {
    return this.client.patch(`${this.baseUrl}/editar`, data);
  }

  async disconnectAttribute(
    id: number,
    type: "localidade" | "secao",
    attributeId: number,
  ) {
    const data = {
      id,
      [type]: {
        disconnect: { id: attributeId },
      },
    };
    return this.client.patch(`${this.baseUrl}/update`, data);
  }

  async connectAttribute(
    id: number,
    type: "localidade" | "secao",
    attributeId: number,
  ) {
    const data = {
      id,
      [type]: {
        connect: { id: attributeId },
      },
    };
    return this.client.patch(`${this.baseUrl}/update`, data);
  }
}

export const supervisorService = new SupervisorService();
