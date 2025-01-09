import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  Button,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  useToast,
  Input,
} from "@/components/ui";
import { MoreHorizontal } from "lucide-react";
import { TImportacaoTable } from "../columns";
import { Row } from "@tanstack/react-table";
import { useContext, useState } from "react";
import { axiosInstance } from "@/services/axios";
import { useSession } from "next-auth/react";
import { ImportandoContext } from "@/context/importacaoContext";
import { LoadingSpinnerModal } from "@/components/template";

interface IAction {
  id: string;
  row: Row<TImportacaoTable>;
}

export const Actions: React.FC<IAction> = ({ id, row }) => {
  const [action, setAction] = useState<{
    modal: boolean;
    action: "update" | "delete";
    waiting: boolean;
    file: File | null;
  }>({
    modal: false,
    action: "update",
    waiting: false,
    file: null,
  });

  const { importando, setImportando } = useContext(ImportandoContext);
  const { toast } = useToast();
  const { data: user } = useSession();
  const referenceDate = row.original.referenceDate.toString();
  const reportId = row.original.id;
  const site = row.original.relatorio;
  const status = row.original.state;
  async function strategicImport() {
    setAction({ ...action, modal: false, waiting: true });
    switch (action.action) {
      case "update":
        await updateImportReport();
        break;
      case "delete":
        await deleteReport();
        break;
    }
  }
  async function updateImportReport() {
    if (!user) return;
    const formData = new FormData();
    formData.append("file", action.file as any);
    formData.append("weekReference", referenceDate);
    formData.append("site", site);
    formData.append("idImportacao", reportId);
    formData.append("user", user?.user.username);
    if (formData.getAll("file")[0] === "null") {
      toast({
        description: "Você precisa selecionar um arquivo para atualizar",
        duration: 1000,
        style: {
          background: "hsl(var(--destructive))",
        },
        variant: "destructive",
      });
      setAction({ ...action, modal: false, waiting: false });
      return;
    }
    try {
      await axiosInstance.patch("/api/v1/import/atualizar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast({
        description: (
          <pre className="mt-2 w-[340px] rounded-md p-4">
            <code className="text-white">
              {JSON.stringify("Feito", null, 2)}
            </code>
          </pre>
        ),
        variant: "success",
      });
    } catch (error) {
      console.error("actions deleteReport", error);
      toast({
        description: (
          <pre className="mt-2 w-[340px] rounded-md p-4">
            <code className="text-white">
              {JSON.stringify("Algo deu errado", null, 2)}
            </code>
          </pre>
        ),
        variant: "destructive",
      });
    } finally {
      setAction({ ...action, modal: false, waiting: false, file: null });
      setImportando(!importando);
    }
  }
  async function deleteReport() {
    if (!user) return;
    const dataForm = {
      weekReference: referenceDate,
      site,
      idImportacao: reportId,
      user: user?.user.username,
      file: action.file,
    };

    try {
      await axiosInstance.delete("/api/v1/import/delete", {
        data: dataForm,
      });

      toast({
        description: (
          <pre className="mt-2 w-[340px] rounded-md p-4">
            <code className="text-white">
              {JSON.stringify("Feito", null, 2)}
            </code>
          </pre>
        ),
        variant: "success",
      });
    } catch (error) {
      console.error("actions deleteReport", error);
      toast({
        description: (
          <pre className="mt-2 w-[340px] rounded-md p-4">
            <code className="text-white">
              {JSON.stringify("Algo deu errado", null, 2)}
            </code>
          </pre>
        ),
        variant: "destructive",
      });
    } finally {
      setAction({ ...action, modal: false, waiting: false });
      setImportando(!importando);
    }
  }
  return (
    <>
      <DropdownMenu modal={false} key={id}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-8 w-8 p-0"
            disabled={
              status === "Importado" || status === "Atualizado" ? false : true
            }
          >
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => {
              setAction({ ...action, modal: true, action: "delete" });
            }}
          >
            Deletar Importação
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setAction({ ...action, modal: true, action: "update" });
            }}
          >
            Atualizar Importação
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialog open={action.modal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza ?</AlertDialogTitle>
            <AlertDialogDescription>
              {action.action === "update"
                ? ` Adicioner o arquivo para realizar a atualização`
                : ` Esta ação não pode ser desfeita. Isso irá excluir permanentemente
              a importação de nossos servidores.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            {action.action === "update" ? (
              <Input
                type="file"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setAction({ ...action, file: e.target.files[0] });
                  }
                }}
              />
            ) : null}

            <AlertDialogCancel
              onClick={() => {
                setAction({ ...action, modal: false });
              }}
            >
              Cancelar
            </AlertDialogCancel>

            <AlertDialogAction onClick={strategicImport}>
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <LoadingSpinnerModal open={action.waiting} title={"Importando"} />
    </>
  );
};
