"use client";
import { FC, useCallback, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Input, Button, useToast, ErrorMessageInput } from "@/components/ui";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { HttpStatusCode } from "@/domain/enum";
import { ErrorHandlerAdapter } from "@/presentation/adapters";
import { AuthenticationError } from "@/domain/errors";

const SignInSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(4, { message: "Mínimo 4 caracteres" }),
});

type TSignInSchema = z.infer<typeof SignInSchema>;

export const FormLogin: FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState } = useForm<TSignInSchema>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onBlur",
  });

  const { toast } = useToast();
  const { errors, isValid } = formState;
  const router = useRouter();

  const onSubmit = useCallback(
    async (data: TSignInSchema) => {
      setIsLoading(true);
      try {
        const result = await signIn("credentials", {
          ...data,
          redirect: false,
        });

        if (result?.error) {
          const errorAdapter = new ErrorHandlerAdapter();
          errorAdapter.handle(
            new AuthenticationError("email ou senha inválidos"),
          );
        }

        if (result?.ok) {
          router.prefetch("/dashboard");
          toast({
            title: "Sucesso",
            description: "Login realizado com sucesso",
            variant: "success",
          });
          router.replace("/dashboard");
        }
      } catch (error) {
        console.error(error);
        toast({
          title: "Erro",
          description:
            error instanceof Error
              ? `${error.message}`
              : "Ocorreu um erro inesperado",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [router, toast],
  );

  return (
    <form
      className="grid gap-6 p-8 rounded-md border w-full max-w-md"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <div className="space-y-4">
        <div>
          <Input
            type="email"
            placeholder="Email"
            autoComplete="email"
            {...register("email")}
            aria-invalid={!!errors.email}
          />
          <ErrorMessageInput error={errors} name="email" />
        </div>

        <div>
          <Input
            type="password"
            placeholder="Senha"
            autoComplete="current-password"
            {...register("password")}
            aria-invalid={!!errors.password}
          />
          <ErrorMessageInput error={errors} name="password" />
        </div>
      </div>

      <Button type="submit" disabled={!isValid || isLoading}>
        {isLoading ? "Carregando..." : "Acessar"}
      </Button>
    </form>
  );
};
