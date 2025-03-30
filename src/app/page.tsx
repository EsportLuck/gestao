import { Suspense } from "react";
import { FormLogin } from "@/components/template/form-login";
import { Metadata } from "next";
import { LoginSkeleton } from "@/components/ui/skeletons/login-skeleton";

export const metadata: Metadata = {
  title: "Login | Sistema de Gestão",
  description: "Faça login para acessar o sistema de gestão",
  robots: "noindex, nofollow",
};

export default function Home() {
  return (
    <main className="min-h-screen grid place-items-center bg-gradient-to-br from-background via-muted/50 to-muted">
      <div className="w-full max-w-md p-6 space-y-4">
        <header className="text-center space-y-2 mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Bem-vindo</h1>
          <p className="text-muted-foreground text-sm">
            Faça login para continuar
          </p>
        </header>
        <Suspense fallback={<LoginSkeleton />}>
          <FormLogin />
        </Suspense>
      </div>
    </main>
  );
}
