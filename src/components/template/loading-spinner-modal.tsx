import {
  AlertDialogHeader,
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui";
import { FC } from "react";

export const LoadingSpinnerModal: FC<{ open: boolean; title: string }> = ({
  open,
  title,
}) => {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="p-0 max-w-[400px]">
        <div className=" w-full p-6 animate-pulse flex place-items-center gap-16">
          <div className="w-8 h-8 border-4 border-l-transparent rounded-full animate-spin" />
          <AlertDialogHeader>
            <AlertDialogTitle>{title}</AlertDialogTitle>
            <AlertDialogDescription>
              Aguarde até finalizar o processo
            </AlertDialogDescription>
          </AlertDialogHeader>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};
