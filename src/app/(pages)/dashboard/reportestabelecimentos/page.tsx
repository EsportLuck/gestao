import React from "react";

import { TitlePage } from "@/components/TitlePage";
import { EstablishmentReportTable } from "@/components/template";

const ReportEstabelecimentos = async () => {
  return (
    <main className="">
      <TitlePage title="Estabelecimentos" />
      <EstablishmentReportTable />
    </main>
  );
};

export default ReportEstabelecimentos;
