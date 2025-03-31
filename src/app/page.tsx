import { Metadata } from "next";
import { HomePage } from "@/presentation";

export const metadata: Metadata = {
  title: "Login | Sistema de Gestão",
  description: "Faça login para acessar o sistema de gestão",
  robots: "noindex, nofollow",
};

export default function Home() {
  return <HomePage />;
}
