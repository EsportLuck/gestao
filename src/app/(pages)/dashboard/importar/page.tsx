import { FC } from "react";
import { TitlePage } from "@/components/TitlePage";
import { ImportacaoReportTable } from "@/components/template";
import { ImportacaoProvider } from "@/context/importacaoContext";
import { FormImport } from "@/app/(pages)/dashboard/importar/components/FormImport";

const Importar: FC = () => {
  return (
    <ImportacaoProvider>
      <section className="container p-0">
        <TitlePage title="Importar" />
        <FormImport />
        <ImportacaoReportTable />
      </section>
    </ImportacaoProvider>
  );
};

export default Importar;
