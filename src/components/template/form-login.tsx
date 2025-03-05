"use client";
import { FC, useCallback } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Input, Button, useToast, ErrorMessageInput } from "@/components/ui";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { HttpStatusCode } from "@/domain/enum";

const SignInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(4, { message: "Campo Obrigatório" }),
});

type TSignInSchema = z.infer<typeof SignInSchema>;

export const FormLogin: FC = () => {
  const { register, handleSubmit, formState } = useForm<TSignInSchema>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const { toast } = useToast();
  const { isSubmitting, errors } = formState;
  const router = useRouter();
  const getData = useCallback(
    async (event: FieldValues) => {
      try {
        const login = await signIn("credentials", {
          ...event,
          redirect: false,
        });

        if (login?.status === HttpStatusCode.UNAUTHORIZED) {
          toast({
            description: "Falha no login",
            variant: "destructive",
          });
          return;
        }

        if (login?.status === HttpStatusCode.OK) {
          router.prefetch("/dashboard");

          toast({
            description: "Login efetuado com sucesso",
            variant: "success",
          });
          router.replace("/dashboard");
          return;
        }
      } catch (error) {
        toast({
          description: "Erro ao realizar login",
          variant: "destructive",
        });
      }
    },
    [router, toast],
  );

  return (
    <form
      className="grid gap-8  p-8 rounded-md border"
      method="post"
      onSubmit={handleSubmit(getData)}
    >
      <label>
        <Input
          type="email"
          placeholder="Email"
          {...register("email", {
            required: { value: true, message: "Campo obrigatório" },
            minLength: { value: 4, message: "Mínimo de 4 caracteres" },
          })}
        />
        {errors["email"] ? (
          <ErrorMessageInput error={errors} name={"email"} />
        ) : null}
      </label>
      <label>
        <Input
          type="password"
          placeholder="Password"
          {...register("password", {
            required: { value: true, message: "Campo obrigatório" },
            minLength: { value: 4, message: "Mínimo de 4 caracteres" },
          })}
        />
        {errors["password"] ? (
          <ErrorMessageInput error={errors} name={"password"} />
        ) : null}
      </label>
      <Button disabled={isSubmitting}>Acessar</Button>
    </form>
  );
};
