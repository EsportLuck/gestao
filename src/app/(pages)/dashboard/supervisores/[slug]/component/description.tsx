"use client";
import { FetchHttpClient } from "@/adapter/FetchHttpClient";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
  useToast,
} from "@/components/ui";
import { useRouter } from "next/navigation";

interface IDescription {
  id: number;
  title: string;
  value: string | Array<{ name: string; id: number }>;
}

export const Description: React.FC<IDescription> = ({ title, value, id }) => {
  const { toast } = useToast();
  const router = useRouter();
  async function deletarConexaoComSupervisor(
    id: number,
    title: "Localidade" | "Seção",
    objetoRemovidoId: number,
  ) {
    const fecth = new FetchHttpClient();
    const data = {
      Localidade: {
        id,
        localidade: {
          disconnect: {
            id: objetoRemovidoId,
          },
        },
      },
      Seção: {
        id,
        secao: {
          disconnect: {
            id: objetoRemovidoId,
          },
        },
      },
    };
    try {
      await fecth.patch("/api/v1/management/supervisores/update", data[title]);
      toast({
        description: "Seção removida com sucesso",
        variant: "success",
      });
    } catch (error) {
      console.error("Error updating supervisor:", error);
      toast({
        description: "Algo deu errado",
        variant: "destructive",
      });
    } finally {
      router.refresh();
    }
  }
  if (title !== "Criado" && typeof value !== "string") {
    return (
      <div className="flex border rounded-sm p-4 items-center gap-2">
        <span className="text-foreground/60">{title}:</span>
        {value?.map((item) => {
          return (
            <div
              className="flex border p-2 pr-7 rounded-sm gap-4 relative"
              key={item.id}
            >
              <span>{item.name}</span>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant={"ghost"}
                    className="p-0 size-5 text-sm absolute right-1 top-0.5"
                    title="remover"
                  >
                    x
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Tem certeza que deseja deletar?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Essa ação não pode ser desfeita
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={async () => {
                        await deletarConexaoComSupervisor(
                          id,
                          title as "Localidade" as "Seção",
                          item.id,
                        );
                      }}
                    >
                      Continuar
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="border rounded-sm p-4">
      <span className="text-foreground/60">{title}:</span>
      {" " + value}
    </div>
  );
};
