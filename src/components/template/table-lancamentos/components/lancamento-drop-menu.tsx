"use client";
import {
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
  Button,
  toast,
} from "@/components/ui";

import { MoreHorizontal } from "lucide-react";
import { useContext, useState } from "react";
import { LancamentosTable } from "../columns";
import { LancamentoContext } from "@/context/lancamentoContext";
import { MenuObservacoes } from "../../menu-observacoes";

const disableButton = (
  status: "reprovado" | "analise" | "aprovado",
  typeButton: "aprovar" | "recusar",
) => {
  if (status === "aprovado" && typeButton === "aprovar") {
    return true;
  }
  if (status === "reprovado" && typeButton === "recusar") {
    return true;
  }
  return false;
};

interface IStrategyAction {
  id: string;
  status: "aprovado" | "reprovado";
  establishmentId: string;
  referenceDate: string;
  type: string;
  value: number;
  status_action: "reprovado" | "analise" | "aprovado";
  id_ciclo?: number;
}

export const LancamentoDropMenu: React.FC<
  Omit<LancamentosTable, "url" | "responsavel" | "estabelecimento">
> = ({
  id,
  status,
  estabelecimento_id,
  data,
  tipo,
  valor,
  observacoes,
  id_ciclo,
}) => {
  const [modalMenu, setModalMenu] = useState({
    alertmenu: false,
    observacoesmenu: false,
  });
  const [isSubmitting, SetIsSubmitting] = useState(false);
  const [statusLancamento, setStatusLancamento] = useState<
    "aprovado" | "reprovado"
  >("aprovado");
  const { lancamento, setLancamento } = useContext(LancamentoContext);
  const modifyLancamento = (
    statusLancamento: "reprovado" | "analise" | "aprovado",
    id: string,
  ) => {
    const data: LancamentosTable[] = lancamento.map((item) => {
      if (item.id == id) {
        return { ...item, status: statusLancamento };
      } else {
        return item;
      }
    });
    setLancamento(data);
  };

  const strategyAction = async (props: IStrategyAction) => {
    if (props.status === "aprovado") {
      try {
        const fetchResult = await fetch(`/api/v1/entering/toapprove`, {
          method: "PUT",
          body: JSON.stringify(props),
        });
        const result = await fetchResult.json();
        if (result.status === 200) {
          toast({
            title: "Sucesso",
            description: `${result.message}`,
            variant: "success",
          });
          modifyLancamento("aprovado", props.id);
        } else {
          toast({
            title: "Falha",
            description: `${result.message}`,
            variant: "destructive",
          });
        }
      } catch (error: any) {
        console.error("lancamento-drop-menu strategyAction", error);
        if (error instanceof Error) {
          toast({
            title: "Falha",
            description: error.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Falha",
            description: error.message,
            variant: "destructive",
          });
        }
      } finally {
        SetIsSubmitting(false);
      }
    }
    if (props.status === "reprovado") {
      try {
        await fetch(`/api/v1/entering/to-disapprove`, {
          method: "PUT",
          body: JSON.stringify(props),
        });
        toast({
          title: "Sucesso",
          description: "Alteração feita com sucesso",
          variant: "success",
        });
        modifyLancamento("reprovado", props.id);
      } catch (error) {
        console.error("lacamentoDropMenu strategyAction", error);
        toast({
          title: "Sucesso",
          description: "Algo deu errado",
          variant: "destructive",
        });
      } finally {
        SetIsSubmitting(false);
      }
    }
  };
  return (
    <>
      <DropdownMenu key={id}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Button
              className={`h-4`}
              variant={"ghost"}
              onClick={() => {
                setModalMenu({ ...modalMenu, alertmenu: true });
              }}
              disabled={
                disableButton(status, "recusar") ||
                disableButton(status, "aprovar")
              }
            >
              Aprovar
            </Button>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Button
              className={`h-4`}
              variant={"ghost"}
              disabled={disableButton(status, "recusar")}
              onClick={() => {
                setModalMenu({ ...modalMenu, alertmenu: true });
                setStatusLancamento("reprovado");
              }}
            >
              Recusar
            </Button>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Button
              className={`h-4`}
              variant={"ghost"}
              onClick={() => {
                setModalMenu({ ...modalMenu, observacoesmenu: true });
              }}
            >
              Comentários
            </Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialog open={modalMenu.alertmenu}>
        <AlertDialogTrigger asChild></AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza absoluta ?</AlertDialogTitle>
            <AlertDialogDescription>
              Essa ação pode lhe custar R$ 1,00
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => setModalMenu({ ...modalMenu, alertmenu: false })}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                const approve = {
                  id: id.toString(),
                  status: statusLancamento,
                  establishmentId: estabelecimento_id.toString(),
                  referenceDate: data.toString(),
                  type: tipo,
                  value: valor,
                  status_action: status,
                  id_ciclo,
                };
                SetIsSubmitting(true);
                strategyAction(approve);
                setModalMenu({ ...modalMenu, alertmenu: false });
              }}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <MenuObservacoes
        id={Number(id)}
        open={modalMenu.observacoesmenu}
        comentarios={observacoes}
        onClick={() => setModalMenu({ ...modalMenu, observacoesmenu: false })}
      />
      <AlertDialog open={isSubmitting}>
        <AlertDialogContent className="p-0 max-w-[400px]">
          <div className=" w-full p-6 animate-pulse flex place-items-center gap-16">
            <div className="w-8 h-8 border-4 border-l-transparent rounded-full animate-spin" />
            <AlertDialogHeader>
              <AlertDialogTitle>Lançando</AlertDialogTitle>
              <AlertDialogDescription>
                Aguarde até finalizar o processo
              </AlertDialogDescription>
            </AlertDialogHeader>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
