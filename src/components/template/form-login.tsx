"use client";
import { FC } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Input, Button, useToast, ErrorMessageInput } from "@/components/ui";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const SignInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(4, { message: "Campo Obrigatório" }),
});

type TSignInSchema = z.infer<typeof SignInSchema>;

export const FormLogin: FC = () => {
  const { register, handleSubmit, formState, reset } = useForm<TSignInSchema>({
    resolver: zodResolver(SignInSchema),
  });
  const { toast } = useToast();
  const { isSubmitting, errors } = formState;
  const router = useRouter();
  async function getData(event: FieldValues) {
    const login = await signIn("credentials", { ...event, redirect: false });
    reset();

    if (login?.status === 401) {
      toast({
        description: "Falha no login",
        variant: "destructive",
      });
    }

    if (login?.status === 200) {
      router.push("/dashboard");
      toast({
        description: "Login efetuado com sucesso",
        variant: "success",
      });
    }
  }

  return (
    <form
      className="grid gap-8 bg-background p-8 rounded-md"
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
