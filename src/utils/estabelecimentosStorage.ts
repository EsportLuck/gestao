import { TEstabelecimento } from "@/types/estabelecimento";
import { localStorageController } from "@/utils/localstorage.controller";
import axios from "axios";

export async function estabelecimentosStorage() {
  try {
    let data = [];
    const cachedData =
      localStorageController.getItemWithExpiry("establishments");
    if (cachedData && new Date(cachedData.expiry) >= new Date()) {
      return (data = cachedData.value);
    }
    const response = await axios.get<Partial<TEstabelecimento[]>>(
      "/api/v1/management/companies",
    );
    localStorageController.setItemWithExpiry(
      "establishments",
      response.data,
      30,
    );

    return (data = response?.data);
  } catch (error) {
    console.error("Erro ao buscar estabelecimentos:", error);
  }
}
