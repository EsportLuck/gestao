"use client";
import ModalProvider from "@/context/modalEstabelecimentosContext";
import { Action } from "./component";
import { Description } from "./component/description";
import { useFetch } from "@/hooks/useFetch";
import { useMemo } from "react";
import { Estabelecimento, Empresa } from "@prisma/client";

interface DetalhesDoEstabelecimento extends Partial<Estabelecimento> {
  localidade: string;
  supervisor: string;
  secao: string;
  empresa: Empresa;
  filiais: Partial<Estabelecimento>[];
  matriz: Partial<Estabelecimento> | null;
}

export default function Page({ params }: { params: { slug: string } }) {
  const fetchEstabelecimento = useFetch<DetalhesDoEstabelecimento>(
    `/api/v1/management/establishments/details?id=${params.slug}`,
  );
  const fetchEmpresas = useFetch<Partial<Estabelecimento[]>>(
    `/api/v1/management/companies`,
  );
  const fetchLocalidades = useFetch<Partial<Estabelecimento[]>>(
    `/api/v1/management/locations`,
  );
  const fetchSecao = useFetch<Partial<Estabelecimento[]>>(
    `/api/v1/management/sections`,
  );
  const fetchRotas = useFetch<Partial<Estabelecimento[]>>(
    `/api/v1/management/routes`,
  );
  const fetchSupervisores = useFetch<Partial<Estabelecimento[]>>(
    `/api/v1/management/supervisores`,
  );
  const estabelecimentoDetalhados = useMemo(() => {
    return fetchEstabelecimento.data;
  }, [fetchEstabelecimento.data]);
  const empresas = useMemo(() => {
    if (!fetchEmpresas.data) return undefined;
    return fetchEmpresas.data.map((item) => {
      return { id: item?.id.toString() as string, name: item?.name as string };
    });
  }, [fetchEmpresas.data]);
  const localidades = useMemo(() => {
    if (!fetchLocalidades.data) return undefined;
    return fetchLocalidades.data.map((item) => {
      return { id: item?.id.toString() as string, name: item?.name as string };
    });
  }, [fetchLocalidades.data]);
  const secao = useMemo(() => {
    if (!fetchSecao.data) return undefined;
    return fetchSecao.data.map((item) => {
      return { id: item?.id.toString() as string, name: item?.name as string };
    });
  }, [fetchSecao.data]);
  const rotas = useMemo(() => {
    if (!fetchRotas.data) return undefined;
    return fetchRotas.data.map((item) => {
      return { id: item?.id.toString() as string, name: item?.name as string };
    });
  }, [fetchRotas.data]);
  const supervisores = useMemo(() => {
    if (!fetchSupervisores.data) return undefined;
    return fetchSupervisores.data.map((item) => {
      return { id: item?.id.toString() as string, name: item?.name as string };
    });
  }, [fetchSupervisores.data]);

  const establishmentDetails = [
    {
      title: "Criado",
      value: new Date(estabelecimentoDetalhados?.createdAt!).toLocaleString(
        "pt-BR",
      ),
    },
    {
      title: "Empresa",
      value: estabelecimentoDetalhados?.empresa.name,
    },
    {
      title: "Localidade",
      value: estabelecimentoDetalhados?.localidade,
    },
    {
      title: "Seção",
      value: estabelecimentoDetalhados?.secao,
    },
    {
      title: "Matriz",
      value: estabelecimentoDetalhados?.matriz === null ? "Sim" : "Não",
    },
    {
      title: "Supervisor",
      value:
        estabelecimentoDetalhados?.supervisor === undefined
          ? "Não definido"
          : estabelecimentoDetalhados.supervisor,
    },
  ];
  const statusStrategyIcon = (status: string | undefined) => {
    switch (status) {
      case "ativo":
        return " 🟢";
      case "inativo":
        return " 🔴";
    }
  };

  return (
    <main className="mt-12">
      <div className="flex justify-between items-center">
        {estabelecimentoDetalhados ? (
          <span
            title={params.slug}
            className="bg-card-foreground/10 p-3 rounded-md hover:bg-card-foreground/15 transition-all "
          >
            Estabelecimento
            <span className="bg-background/15 p-1 rounded-sm">{`${estabelecimentoDetalhados.name}${statusStrategyIcon(estabelecimentoDetalhados.status_atividade?.toLowerCase())}`}</span>
          </span>
        ) : (
          <span className="animate-pulse rounded">Carregando...</span>
        )}

        <div tabIndex={0}>
          {supervisores && rotas && secao && empresas && localidades ? (
            <ModalProvider>
              <Action
                localidade={localidades}
                rota={rotas}
                secao={secao}
                filiais={empresas}
                supervisor={supervisores}
              />
            </ModalProvider>
          ) : (
            <span className="animate-pulse rounded">Carregando...</span>
          )}
        </div>
      </div>
      <div className="grid mt-12 gap-2">
        {estabelecimentoDetalhados
          ? establishmentDetails.map((item) => (
              <Description
                key={item.title}
                title={item.title}
                valeu={item.value as string}
              />
            ))
          : establishmentDetails.map((item, index) => (
              <Description
                className="animate-pulse rounded"
                key={index}
                title={item.title}
                valeu={"carregando..."}
              />
            ))}
      </div>
    </main>
  );
}
