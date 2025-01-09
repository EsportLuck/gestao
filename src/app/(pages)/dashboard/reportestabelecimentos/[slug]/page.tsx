import ModalProvider from "@/context/modalEstabelecimentosContext";
import { Action } from "./component";
import { Description } from "./component/description";

interface IResponse {
  id: number;
  name: string;
}
function convertId(data: IResponse[]) {
  if (data.length === 0) return;
  return data.map((item) => {
    return {
      id: item.id.toString(),
      name: item.name,
    };
  });
}

async function getEstablishments(id: string) {
  try {
    const response = await fetch(
      `${process.env.API_URL}/management/establishments/details?id=${id}`,
      {
        cache: "no-store",
      },
    );
    if (!response.ok) throw new Error("Failed to fetch data");
    const estabelecimento = await response.json();

    return estabelecimento;
  } catch (err) {
    return [];
  }
}
async function getData() {
  try {
    const [
      establishmentsResponse,
      locationsResponse,
      sectionsReponse,
      routesResponse,
      supervisorResponse,
      empresasResponse,
    ] = await Promise.all([
      fetch(`${process.env.API_URL}/management/companies`, {
        cache: "no-store",
      }),
      fetch(`${process.env.API_URL}/management/locations`, {
        cache: "no-store",
      }),
      fetch(`${process.env.API_URL}/management/sections`, {
        cache: "no-store",
      }),
      fetch(`${process.env.API_URL}/management/routes`, {
        cache: "no-store",
      }),
      fetch(`${process.env.API_URL}/management/supervisores`, {
        cache: "no-store",
      }),
      fetch(`${process.env.API_URL}/management/empresa/obterTodas`, {
        cache: "no-store",
      }),
    ]);

    if (!establishmentsResponse.ok)
      throw new Error("Failed to fetch data estabelecimentos");
    if (!locationsResponse.ok)
      throw new Error("Failed to fetch data localidades");
    if (!sectionsReponse.ok) throw new Error("Failed to fetch data seções");
    if (!routesResponse.ok) throw new Error("Failed to fetch data rotas");
    if (!supervisorResponse.ok)
      throw new Error("Failed to fetch data supervisores");
    if (!empresasResponse.ok) throw new Error("Failed to fetch data empresas");
    let estabelecimento: IResponse[] = await establishmentsResponse.json();
    let location: IResponse[] = await locationsResponse.json();
    let section: IResponse[] = await sectionsReponse.json();
    let route: IResponse[] = await routesResponse.json();
    let supervisor: IResponse[] = await supervisorResponse.json();

    const estabelecimentos = convertId(estabelecimento);
    const locations = convertId(location);
    const sections = convertId(section);
    const routes = convertId(route);
    const supervisores = convertId(supervisor);
    return {
      estabelecimentos,
      locations,
      sections,
      routes,
      supervisores,
    };
  } catch (err) {
    console.error("obter informações para relatorio estabelecimentos", err);
    return { estabelecimentos: [], locations: [], sections: [], routes: [] };
  }
}

export default async function Page({ params }: { params: { slug: string } }) {
  const data = await getEstablishments(params.slug);
  const manager = await getData();
  const establishmentDetails = [
    {
      title: "Criado",
      value: new Date(data.createdAt).toLocaleString("pt-BR"),
    },
    {
      title: "Empresa",
      value: data.empresa.name,
    },
    {
      title: "Localidade",
      value: data.localidade,
    },
    {
      title: "Seção",
      value: data.secao,
    },
    {
      title: "Matriz",
      value: data.matriz === null ? "Sim" : "Não",
    },
    {
      title: "Supervisor",
      value: data.supervisor === undefined ? "Não definido" : data.supervisor,
    },
  ];
  const statusStrategyIcon = (status: "ativo" | "inativo") => {
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
        <span
          title={params.slug}
          className="bg-card-foreground/10 p-3 rounded-md hover:bg-card-foreground/15 transition-all "
        >
          Estabelecimento{" "}
          <span className="bg-background/15 p-1 rounded-sm">{`${data.name}${statusStrategyIcon(data.status_atividade.toLowerCase())}`}</span>
        </span>
        <div tabIndex={0}>
          <ModalProvider>
            <Action
              localidade={manager.locations}
              rota={manager.routes}
              secao={manager.sections}
              filiais={manager.estabelecimentos}
              supervisor={manager.supervisores}
            />
          </ModalProvider>
        </div>
      </div>
      <div className="grid mt-12 gap-2">
        {establishmentDetails.map((item) => (
          <Description key={item.title} title={item.title} valeu={item.value} />
        ))}
      </div>
    </main>
  );
}
