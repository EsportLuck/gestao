"use client";

import { useToast } from "@/components/ui";
import { useRouter } from "next/navigation";
import { SupervisorDetailProps } from "@/types/supervisor";
import { supervisorService } from "@/domain/services/supervisorService";
import { useState } from "react";
import { ConfirmationDialog } from "@/components/template";

export const Description: React.FC<SupervisorDetailProps> = ({
  title,
  value,
  id,
}) => {
  const { toast } = useToast();
  const router = useRouter();
  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    itemId: 0,
  });

  const handleDelete = async (attributeId: number) => {
    try {
      await supervisorService.disconnectAttribute(
        id,
        title as "localidade" | "secao",
        attributeId,
      );
      toast({
        description: `${title} removida com sucesso`,
        variant: "success",
      });
      router.refresh();
    } catch (error) {
      console.error(`Error removing ${title}:`, error);
      toast({
        description: "Algo deu errado",
        variant: "destructive",
      });
    }
  };

  if (title === "Criado" || typeof value === "string") {
    return (
      <div className="border rounded-sm p-4">
        <span className="text-foreground/60">{title}:</span>
        {" " + value}
      </div>
    );
  }

  return (
    <>
      <div className="flex border rounded-sm p-4 items-center gap-2">
        <span className="text-foreground/60">{title}:</span>
        {value?.map((item) => (
          <div
            key={item.id}
            className="flex border p-2 pr-7 rounded-sm gap-4 relative"
          >
            <span>{item.name}</span>
            <button
              onClick={() => setDeleteDialog({ isOpen: true, itemId: item.id })}
              className="p-0 size-5 text-sm absolute right-1 top-0.5"
              title="remover"
            >
              x
            </button>
          </div>
        ))}
      </div>

      <ConfirmationDialog
        isOpen={deleteDialog.isOpen}
        title="Tem certeza que deseja deletar?"
        description="Essa ação não pode ser desfeita"
        onConfirm={() => {
          handleDelete(deleteDialog.itemId);
          setDeleteDialog({ isOpen: false, itemId: 0 });
        }}
        onCancel={() => setDeleteDialog({ isOpen: false, itemId: 0 })}
      />
    </>
  );
};
