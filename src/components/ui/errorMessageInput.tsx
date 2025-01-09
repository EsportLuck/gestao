import { cn } from "@/lib/utils";
import React, { FC } from "react";
import { FieldErrors, FieldValues } from "react-hook-form";

interface IErrorMessage {
  error: FieldErrors<FieldValues>;
  name: string;
  className?: string;
  props?: React.HTMLAttributes<HTMLSpanElement>;
}

export const ErrorMessageInput: FC<IErrorMessage> = ({
  error,
  name,
  className,
  ...props
}) => {
  return (
    <span
      className={cn("text-destructive text-xs mt-2 ms-1 " + className)}
      {...props}
    >
      {error[name]?.message === "Input not instance of FileList"
        ? "Informe um arquivo"
        : (error[name]?.message as string)}
    </span>
  );
};
