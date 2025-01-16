"use client";
import ModalProvider from "@/context/modalEstabelecimentosContext";
import { Action } from "./component";
import { Description } from "./component/description";
import { TituloSupervisor } from "./component/titulo-supervisor";
import { useFetch } from "@/hooks/useFetch";
import { Localidade, Rota, Secao, Supervisor } from "@prisma/client";
import { useMemo } from "react";

interface SupervisorDetalhado extends Supervisor {
  localidade: string;
  secao: string;
  criado: string;
}

export default function DetalhesDoSupervisor({
  params,
}: {
  params: { slug: string };
}) {
  const fetchSupervisor = useFetch<SupervisorDetalhado>(
    `/api/v1/management/supervisores/detalhar?id=${params.slug}`,
  );
  const fetchLocalidades = useFetch<Partial<Localidade[]>>(
    `/api/v1/management/locations`,
  );
  const fetchSecao = useFetch<Partial<Secao[]>>(`/api/v1/management/sections`);
  const fetchRotas = useFetch<Partial<Rota[]>>(`/api/v1/management/routes`);
  const supervisor = useMemo(() => {
    if (!fetchSupervisor.data) return undefined;
    return fetchSupervisor.data;
  }, [fetchSupervisor.data]);

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
  const definicoesDoSupervisor = [
    {
      title: "Criado",
      value: supervisor?.criado,
    },
    {
      title: "Localidade",
      value: supervisor?.localidade.length
        ? supervisor?.localidade
        : "sem registro",
    },
    {
      title: "Seção",
      value: supervisor?.secao.length ? supervisor?.secao : "sem registro",
    },
  ];

  return (
    <main className="mt-12">
      <div className="flex justify-between items-center">
        {supervisor ? (
          <TituloSupervisor
            title={params.slug}
            name={supervisor?.name as string}
          />
        ) : (
          <span>Carregando...</span>
        )}

        <div>
          <ModalProvider>
            {localidades && rotas && secao ? (
              <Action localidade={localidades} rota={rotas} secao={secao} />
            ) : (
              <span className="animate-pulse rounded">Carregando...</span>
            )}
          </ModalProvider>
        </div>
      </div>
      <div className="grid mt-12 gap-2">
        {definicoesDoSupervisor.map((item) => (
          <Description
            key={item.title}
            title={item.title}
            value={item.value as string}
            id={Number(params.slug)}
          />
        ))}
      </div>
    </main>
  );
}
