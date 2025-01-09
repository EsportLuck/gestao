"use client";

import React from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Controller, FieldValues, useForm } from "react-hook-form";
import { ErrorMessageInput } from "@/components/ui";
import {
  Input,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  useToast,
  Button,
} from "@/components/ui";
import { FetchHttpClient } from "@/adapter/FetchHttpClient";

const formSchema = z.object({
  username: z
    .string({ required_error: "Campo obrigatório" })
    .min(4, { message: "Mínimo de 4 caracteres" }),
  email: z
    .string({ required_error: "Campo obrigatório" })
    .email({ message: "Email inválido" }),
  password: z
    .string({ required_error: "Campo obrigatório" })
    .min(4, { message: "Mínimo de 4 caracteres" }),
  confirmPassword: z
    .string({ required_error: "Campo obrigatório" })
    .min(4, { message: "Mínimo de 4 caracteres" }),
  role: z
    .string({ required_error: "Campo obrigatório" })
    .nonempty({ message: "Campo obrigatório" }),
  site: z
    .string({ required_error: "Campo obrigatório" })
    .nonempty({ message: "Campo obrigatório" }),
});

type TFormSchema = z.infer<typeof formSchema>;

export default function FormRegister() {
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
    resetField,
  } = useForm<TFormSchema>({
    resolver: zodResolver(formSchema),
  });
  function resetForm() {
    resetField("username", {
      defaultValue: "",
    });
    resetField("email", {
      defaultValue: "",
    });
    resetField("password", {
      defaultValue: "",
    });
    resetField("confirmPassword", {
      defaultValue: "",
    });
    resetField("role", {
      defaultValue: "",
    });
    resetField("site", {
      defaultValue: "",
    });
  }

  async function handleSubmitForm(data: FieldValues) {
    try {
      const fetch = new FetchHttpClient();
      await fetch.post("/api/v1/user/create", data);
      toast({
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <p className="text-white">Usuário criado</p>
          </pre>
        ),
        variant: "success",
      });
      resetForm();
      toast({
        description: <p className="text-white">Usuário Criado</p>,
        variant: "success",
      });
    } catch (error) {
      resetForm();
      toast({
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <p className="text-white-500">Algo deu errado</p>
          </pre>
        ),
        variant: "destructive",
      });
    }
  }

  return (
    <form className="mt-12 " onSubmit={handleSubmit(handleSubmitForm)}>
      <div className="grid gap-4 justify-start max-xl:justify-center">
        <div>
          <Controller
            control={control}
            name="username"
            render={({ field }) => (
              <Input
                placeholder="Nome"
                type="text"
                onChange={(event) => field.onChange(event.target.value)}
                value={field.value}
              />
            )}
          />

          {errors.username ? (
            <ErrorMessageInput error={errors} name={"username"} />
          ) : null}
        </div>
        <div>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <Input
                placeholder="Email"
                type="email"
                onChange={(event) => field.onChange(event.target.value)}
                value={field.value}
              />
            )}
          />
          {errors["email"] ? (
            <ErrorMessageInput error={errors} name={"email"} />
          ) : null}
        </div>
        <div>
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <Input
                placeholder="Senha"
                type="password"
                onChange={(event) => field.onChange(event.target.value)}
                value={field.value}
              />
            )}
          />
          {errors["password"] ? (
            <ErrorMessageInput error={errors} name={"password"} />
          ) : null}
        </div>
        <div>
          <Controller
            name="confirmPassword"
            control={control}
            render={({ field }) => (
              <Input
                placeholder="Confirmar Senha"
                type="password"
                onChange={(event) => field.onChange(event.target.value)}
                value={field.value}
              />
            )}
          />
          {errors["confirmPassword"] && (
            <ErrorMessageInput error={errors} name={"confirmPassword"} />
          )}
        </div>
        <Controller
          control={control}
          name="role"
          render={({ field }) => (
            <div>
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="w-[240px]">
                  <SelectValue placeholder="Escolha um cargo" />
                </SelectTrigger>

                <SelectContent
                  {...register("role", {
                    required: { value: true, message: "Campo obrigatório" },
                  })}
                >
                  <SelectGroup defaultValue={field.value}>
                    <SelectItem value="administrador">Administrador</SelectItem>
                    <SelectItem value="gestor">Gestor</SelectItem>
                    <SelectItem value="funcionario">Funcionário</SelectItem>
                    <SelectItem value="gerente">Gerente</SelectItem>
                    <SelectItem value="supervisor">Supervisor</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              {errors["role"] && (
                <ErrorMessageInput error={errors} name={"role"} />
              )}
            </div>
          )}
        />
        <Controller
          control={control}
          name="site"
          render={({ field }) => (
            <div>
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="w-[240px]">
                  <SelectValue placeholder="Escolha um site" />
                </SelectTrigger>

                <SelectContent
                  {...register("site", {
                    required: { value: true, message: "Campo obrigatório" },
                  })}
                >
                  <SelectGroup defaultValue={field.value}>
                    <SelectItem value="arena">Arena</SelectItem>
                    <SelectItem value="sportNet">SportNet</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              {errors["site"] && (
                <ErrorMessageInput error={errors} name={"site"} />
              )}
            </div>
          )}
        />

        <Button variant={"outline"} disabled={isSubmitting}>
          Registrar
        </Button>
      </div>
    </form>
  );
}
