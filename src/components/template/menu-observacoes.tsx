"use client";
import { FetchHttpClient } from "@/adapter/FetchHttpClient";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  Button,
  DialogHeader,
  Textarea,
  toast,
} from "@/components/ui";
import { Loader } from "lucide-react";
import { useSession } from "next-auth/react";
import { FC, useState } from "react";

export const MenuObservacoes: FC<{
  id: number;
  open: boolean;
  comentarios: { id: number; comentario: string; createdBy: string }[];
  onClick: () => void;
}> = ({ id, open, comentarios, onClick }) => {
  const { data: session } = useSession();
  const fecth = new FetchHttpClient();

  const [menuObservacoes, setMenuObservacoes] = useState({
    novoComentario: "",
    submitNovoComentario: false,
  });
  const [mostrarInput, setMostrarInput] = useState(false);
  const adicionarNovoComentario = () => {
    try {
      setMenuObservacoes({
        submitNovoComentario: true,
        novoComentario: "",
      });
      fecth.post("/api/v1/entering/criar-observacao", {
        id,
        comentario: menuObservacoes.novoComentario,
        createdBy: session?.user.username as string,
      });
      toast({
        description: "Novo comentário adicionado com sucesso",
        variant: "success",
      });
    } catch (error) {
      toast({
        description: "Algo Deu Errado",
        variant: "destructive",
      });
      console.error("adicionar novo comentario", error);
    } finally {
      setMenuObservacoes({
        submitNovoComentario: false,
        novoComentario: "",
      });
      setMostrarInput(false);
    }
  };
  const MostrarInputParaAdicionarComentario = () => {
    setMostrarInput(!mostrarInput);
  };
  return (
    <Dialog open={open} onOpenChange={onClick}>
      <DialogTrigger asChild>
        <Button variant={"outline"} className="h-full p-0"></Button>
      </DialogTrigger>
      <DialogContent className="overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Observações</DialogTitle>
          <DialogDescription>
            Aqui estão as observações relacionadas:
          </DialogDescription>
        </DialogHeader>
        {comentarios.length > 0 &&
          comentarios.map((item) => (
            <div key={item.id}>
              <strong>
                Autor:{" "}
                <span className="text-foreground/70">
                  {item.createdBy ? item.createdBy : "Desconhecido"}
                </span>
              </strong>
              <p>{item.comentario}</p>
            </div>
          ))}
        <>
          <Button
            variant={"ghost"}
            className="gap-2"
            onClick={MostrarInputParaAdicionarComentario}
          >
            {menuObservacoes.submitNovoComentario ? (
              <Loader className="h-4 w-4 loader " />
            ) : (
              <span>Novo comentário</span>
            )}
          </Button>
          {mostrarInput && (
            <>
              <Textarea
                placeholder="Adicione um comentário..."
                className="w-full border p-2 rounded mb-2"
                onChange={(e) =>
                  setMenuObservacoes({
                    ...menuObservacoes,
                    novoComentario: e.target.value,
                  })
                }
              />
              <Button onClick={adicionarNovoComentario} className="w-full">
                Comentar
              </Button>
            </>
          )}
        </>
      </DialogContent>
    </Dialog>
  );
};
