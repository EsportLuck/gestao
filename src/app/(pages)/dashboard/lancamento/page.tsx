import { TitlePage } from "@/components/TitlePage";
import LancamentoProvider from "@/context/lancamentoContext";
import { LayoutPage } from "./components/layoutpage";

export default function Lancamento() {
  return (
    <main className="grid gap-2 ">
      <TitlePage title="Lançamento" />
      <LancamentoProvider>
        <LayoutPage />
      </LancamentoProvider>
    </main>
  );
}
