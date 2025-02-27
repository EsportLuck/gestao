import { ListItem } from "./list-item";
import { useSession } from "next-auth/react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui";

export const NavMenu = () => {
  const { data: session } = useSession();
  const PERMISSIONSADM = ["Criar usuário"];
  const PERMISSIONSSUP = [
    "Sangria",
    "Lançamento",
    "Estabelecimentos",
    "Lançamento",
    "Importar",
    "Cobrança",
    "Deposito",
    "Sangria",
    "Controle",
    "Supervisores",
  ];
  const menuNav = [
    {
      option: "Relatórios",
      list: [
        {
          title: "Extrato",
          href: "/dashboard/extrato",
          description:
            "Mostra a movimentação dos estabelecimentos facilmente com filtros de localidade, supervisor, seção e rota.",
        },
        {
          title: "Estabelecimentos",
          href: "/dashboard/reportestabelecimentos",
          description: "Tem uma visão mais detalhada sobre os estabelecimentos",
        },
        {
          title: "Supervisores",
          href: "/dashboard/supervisores",
          description: "Tem uma visão mais detalhada sobre os supervisores",
        },
      ],
    },
    {
      option: "Controle",
      list: [
        {
          title: "Lançamento",
          href: "/dashboard/lancamento",
          description:
            "Cria lançamentos nos estabelecimentos para controle de caixa",
        },
        {
          title: "Conclusão de ciclo",
          href: "/dashboard/lancamento/prestacao",
          description: "Finalizar o ciclo de prestação dos estabelecimentos",
        },

        {
          title: "Importar",
          href: "/dashboard/importar",
          description: "Realiza a importação dos relatórios dos produtos",
        },
        {
          title: "Criar Caixas",
          href: "/dashboard/criar-caixas",
          description: "Cria caixas para controlar os estabelecimentos",
        },
        // {
        //   title: "Cobrança",
        //   href: "/dashboard/cobranca",
        //   description: "Semana de prestação dos estabelecimentos",
        // },
        // {
        //   title: "Deposito",
        //   href: "/dashboard/deposito",
        //   description:
        //     "Valores que os estabelecimentos podem precisar durante a semana",
        // },
        // {
        //   title: "Sangria",
        //   href: "/dashboard/sangria",
        //   description:
        //     "Valores que os estabelecimentos podem precisar durante a semana",
        // },
      ],
    },
    {
      option: "Cadastro",
      list: [
        {
          title: "Criar usuário",
          href: "/dashboard/register",
          description: "Crie um novo usuário para o sistema",
        },
        {
          title: "Criar Localidade",
          href: "/dashboard/register/criar/localidade",
          description: "Cria localidade para controlar os estabelecimentos",
        },
        {
          title: "Criar Seção",
          href: "/dashboard/register/criar/secao",
          description: "Cria Seção para controlar os estabelecimentos",
        },
        {
          title: "Criar Rota",
          href: "/dashboard/register/criar/rota",
          description: "Cria Rota para controlar os estabelecimentos",
        },
        {
          title: "Criar Estabelecimento",
          href: "/dashboard/register/estabelecimento",
          description: "Adiciona um novo estabelecimento",
        },
        {
          title: "Criar Empresa",
          href: "/dashboard/register/empresa",
          description: "Cria Empresa para controlar os estabelecimentos",
        },
      ],
    },
  ];

  const isAdmin = () => {
    return session?.user.role === "administrador";
  };
  const isSup = () => {
    return session?.user.role === "supervisor";
  };
  return (
    <NavigationMenu>
      <NavigationMenuList>
        {menuNav.map((item) => {
          return (
            <NavigationMenuItem key={item.option}>
              {PERMISSIONSSUP.includes(item.option) && isSup() ? null : (
                <NavigationMenuTrigger key={item.option}>
                  {item.option}
                </NavigationMenuTrigger>
              )}

              <NavigationMenuContent>
                <ul className="grid w-[420px] gap-3 p-4 md:w-[500px] lg:grid-cols-2 lg:w-[900px] ">
                  {item.list.map((listItem) => {
                    if (
                      (PERMISSIONSADM.includes(listItem.title) && !isAdmin()) ||
                      (PERMISSIONSSUP.includes(listItem.title) && isSup())
                    ) {
                      return null;
                    }
                    return (
                      <ListItem
                        key={listItem.title}
                        title={listItem.title}
                        href={listItem.href}
                      >
                        {listItem.description}
                      </ListItem>
                    );
                  })}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          );
        })}
      </NavigationMenuList>
    </NavigationMenu>
  );
};
