import { TitlePage } from "@/components/TitlePage";
import { FormExtrato } from "./FormExtrato";

export async function ExtratoPage() {
  return (
    <section className="">
      <TitlePage title="Extrato" />
      <FormExtrato />
    </section>
  );
}
