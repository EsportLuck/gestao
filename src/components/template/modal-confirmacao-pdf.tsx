import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogClose,
  Button,
} from "@/components/ui";
import { FileDown } from "lucide-react";
import { FC, MouseEventHandler } from "react";

interface IModalConfirmacoPdf {
  onClick: MouseEventHandler<HTMLButtonElement>;
}

export const ModalConfirmacaoPdf: FC<IModalConfirmacoPdf> = ({ onClick }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"outline"} className="h-full p-0">
          <FileDown />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Gerar o PDF</DialogTitle>
          <DialogDescription>Deseja gerar o PDF do extrato?</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button onClick={onClick}>Sim</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button variant={"outline"}>Não</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
