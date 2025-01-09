import { TitlePage } from "@/components/TitlePage";
import { FormExtrato } from "./components/FormExtrato";

async function ExtratoPage() {
  return (
    <section className="">
      <TitlePage title="Extrato" />
      <FormExtrato />
    </section>
  );
}

export default ExtratoPage;
