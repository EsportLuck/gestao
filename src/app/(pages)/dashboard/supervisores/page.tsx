import React from "react";

import { TitlePage } from "@/components/TitlePage";
import { ReportTableSupervisores } from "@/components/template";

const ReportEstabelecimentos = async () => {
  return (
    <main className="">
      <TitlePage title="Supervisores" />
      <ReportTableSupervisores />
    </main>
  );
};

export default ReportEstabelecimentos;
