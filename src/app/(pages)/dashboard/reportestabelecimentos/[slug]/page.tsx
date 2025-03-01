"use client";
import ModalProvider from "@/context/modalEstabelecimentosContext";
import { Action } from "./component";
import { Description } from "./component/description";
import {
  useLocalidades,
  useSecoes,
  useRota,
  useSupervisores,
  useEstabelecimentos,
  useEstabelecimentoDetalhado,
} from "@/hooks";

export default function Page({ params }: { params: { slug: string } }) {
  const { localidades } = useLocalidades();
  const { secao } = useSecoes();
  const { rotas } = useRota();
  const { supervisores } = useSupervisores();
  const { estabelecimentos } = useEstabelecimentos();
  const { estabelecimentoDetalhado } = useEstabelecimentoDetalhado(params.slug);

  const establishmentDetails = [
    {
      title: "Criado",
      value: new Date(estabelecimentoDetalhado?.createdAt!).toLocaleString(
        "pt-BR",
      ),
    },
    {
      title: "Empresa",
      value: estabelecimentoDetalhado?.empresa?.name,
    },
    {
      title: "Localidade",
      value: estabelecimentoDetalhado?.localidade,
    },
    {
      title: "Seção",
      value: estabelecimentoDetalhado?.secao,
    },
    {
      title: "Matriz",
      value: estabelecimentoDetalhado?.matriz === null ? "Sim" : "Não",
    },
    {
      title: "Supervisor",
      value:
        estabelecimentoDetalhado?.supervisor === undefined
          ? "Não definido"
          : estabelecimentoDetalhado.supervisor,
    },
    {
      title: "Filias",
      value:
        estabelecimentoDetalhado?.filiais?.length === 0
          ? "Não definido"
          : estabelecimentoDetalhado?.filiais
              .map((filia) => filia.name)
              .join(", "),
    },
    {
      title: "Comissão Retida",
      value:
        estabelecimentoDetalhado?.comissao_retida === undefined
          ? "Não definido"
          : estabelecimentoDetalhado.comissao_retida
            ? "Sim"
            : "Não",
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
        {estabelecimentoDetalhado ? (
          <span
            title={params.slug}
            className="bg-card-foreground/10 p-3 rounded-md hover:bg-card-foreground/15 transition-all "
          >
            Estabelecimento
            <span className="bg-background/15 p-1 rounded-sm">{`${estabelecimentoDetalhado.name}${statusStrategyIcon(estabelecimentoDetalhado.status_atividade?.toLowerCase())}`}</span>
          </span>
        ) : (
          <span className="animate-pulse rounded">Carregando...</span>
        )}

        <div tabIndex={0}>
          {supervisores && rotas && secao && estabelecimentos && localidades ? (
            <ModalProvider>
              <Action
                localidade={localidades}
                rota={rotas}
                secao={secao}
                filiais={estabelecimentos}
                supervisor={supervisores}
              />
            </ModalProvider>
          ) : (
            <span className="animate-pulse rounded">Carregando...</span>
          )}
        </div>
      </div>
      <div className="grid mt-12 gap-2">
        {estabelecimentoDetalhado
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
