import { obterInicioEFimDoCiclo } from "@/app/api/v1/utils/obterInicioEFimDoCiclo";
import { useSession } from "next-auth/react";
import { useCallback, useMemo } from "react";
import { useFetch } from "./useFetch";
import { EstabelecimentosExtrato } from "@/components/template/estabelecimentos-report-table/columns";

interface ExtractResponse {
  extrato: EstabelecimentosExtrato[];
}
export const useExtractData = () => {
  const { data: sessionData } = useSession();
  const { inicioDoCiclo, finalDoCiclo } = obterInicioEFimDoCiclo(new Date());

  const buildQueryParams = useCallback(() => {
    if (!sessionData?.user) return null;

    const params = {
      dataInicial: inicioDoCiclo.toISOString(),
      dataFinal: finalDoCiclo.toISOString(),
      localidade: "undefined",
      secao: "undefined",
      rota: "undefined",
      supervisor: "undefined",
      estabelecimento: "undefined",
      role: sessionData.user.role,
      username: sessionData.user.username,
      site: sessionData.user.site,
    };

    return new URLSearchParams(params).toString();
  }, [sessionData, inicioDoCiclo, finalDoCiclo]);

  const url = useMemo(() => {
    const queryParams = buildQueryParams();
    return queryParams ? `/api/v1/extract?${queryParams}` : null;
  }, [buildQueryParams]);

  return useFetch<ExtractResponse>(url!, Boolean(url));
};
