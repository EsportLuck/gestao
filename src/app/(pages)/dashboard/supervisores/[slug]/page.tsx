import ModalProvider from "@/context/modalEstabelecimentosContext";
import { Action } from "./component";
import { Description } from "./component/description";
import { TituloSupervisor } from "./component/titulo-supervisor";
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

async function obterSupervisor(id: string) {
  try {
    const response = await fetch(
      `${process.env.API_URL}/management/supervisores/detalhar?id=${id}`,
      {
        cache: "no-store",
      },
    );

    if (!response.ok) throw new Error("Failed to fetch data");
    const supervisor = await response.json();
    return supervisor;
  } catch (err) {
    return [];
  }
}
async function getData() {
  try {
    const [locationsResponse, sectionsReponse, routesResponse] =
      await Promise.all([
        fetch(`${process.env.API_URL}/management/locations`, {
          cache: "no-store",
        }),
        fetch(`${process.env.API_URL}/management/sections`, {
          cache: "no-store",
        }),
        fetch(`${process.env.API_URL}/management/routes`, {
          cache: "no-store",
        }),
      ]);
    if (!locationsResponse.ok) throw new Error("Failed to fetch data");
    if (!sectionsReponse.ok) throw new Error("Failed to fetch data");
    if (!routesResponse.ok) throw new Error("Failed to fetch data");
    let location: IResponse[] = await locationsResponse.json();
    let section: IResponse[] = await sectionsReponse.json();
    let route: IResponse[] = await routesResponse.json();

    const locations = convertId(location);
    const sections = convertId(section);
    const routes = convertId(route);

    return { locations, sections, routes };
  } catch (err) {
    return { estabelecimentos: [], locations: [], sections: [], routes: [] };
  }
}

export default async function Page({ params }: { params: { slug: string } }) {
  const data = await obterSupervisor(params.slug);
  const manager = await getData();
  const definicoesDoSupervisor = [
    {
      title: "Criado",
      value: data.criado,
    },
    {
      title: "Localidade",
      value: data.localidade.length ? data.localidade : "sem registro",
    },
    {
      title: "Seção",
      value: data.secao.length ? data.secao : "sem registro",
    },
  ];

  return (
    <main className="mt-12">
      <div className="flex justify-between items-center">
        <TituloSupervisor title={params.slug} name={data.name} />
        <div>
          <ModalProvider>
            <Action
              localidade={manager.locations}
              rota={manager.routes}
              secao={manager.sections}
            />
          </ModalProvider>
        </div>
      </div>
      <div className="grid mt-12 gap-2">
        {definicoesDoSupervisor.map((item) => (
          <Description
            key={item.title}
            title={item.title}
            value={item.value}
            id={Number(params.slug)}
          />
        ))}
      </div>
    </main>
  );
}
