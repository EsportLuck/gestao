import { toast } from "@/components/ui";
import { Empresa } from "@prisma/client";
import axios, { AxiosError } from "axios";
import { Session } from "next-auth";
import { FieldValues } from "react-hook-form";

type THandleForm = {
  form: FieldValues;
  session: Session | null;
};
export async function handleForm(data: THandleForm) {
  try {
    if (typeof data.session?.user.username === "undefined") {
      throw new Error("Usuario não autenticado");
    }
    if (data.form.date === "" || data.form.empresa === "") {
      throw new Error("Preencha todos os campos");
    }

    const queryParams = new URLSearchParams({
      date: data.form.date,
      empresa: data.form.empresa,
      user: data.session.user.username,
    });
    const response = await axios.get(
      `/api/v1/cronjob?${queryParams.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_CRON_SECRET}`,
        },
      },
    );

    if (response.status === 200) {
      toast({
        description: (
          <code className="text-slate-200">{response.data.message}</code>
        ),
        variant: "success",
      });
    } else {
      toast({
        description: (
          <pre className="rounded-md p-4">
            <code className="text-slate-200 text-wrap">
              {response.data.message}
            </code>
          </pre>
        ),
        variant: "destructive",
      });
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      toast({
        description: (
          <pre className="rounded-md p-4">
            <code className="text-slate-200 text-wrap">
              {error.response?.data.message}
            </code>
          </pre>
        ),
        variant: "destructive",
      });
    } else {
      toast({
        description: (
          <pre className="rounded-md p-4">
            <code className="text-slate-200 text-wrap">Erro interno</code>
          </pre>
        ),
        variant: "destructive",
      });
    }
  }
}
