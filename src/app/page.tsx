import { FormLogin } from "@/components/template/form-login";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Login | Sistema de Gestão',
  description: 'Faça login para acessar o sistema de gestão',
};

export default async function Home() {
  return (
    <main className="min-h-screen grid place-items-center mx-auto bg-gradient-to-b from-background to-muted">
      <div className="w-full max-w-md p-6 space-y-4">
        <div className="text-center space-y-2 mb-6">
          <h1 className="text-2xl font-bold">Bem-vindo</h1>
          <p className="text-muted-foreground">Faça login para continuar</p>
        </div>
        <FormLogin />
      </div>
    </main>
  );
}
