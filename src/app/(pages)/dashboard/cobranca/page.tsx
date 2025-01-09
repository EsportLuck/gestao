import React, { FC } from "react";

import { CobrancaReportTable } from "@/components/template";
import { TitlePage } from "@/components/TitlePage";

const Cobranca: FC = () => {
  return (
    <main className="">
      <TitlePage title="Cobrança" />
      <CobrancaReportTable />
    </main>
  );
};

export default Cobranca;
