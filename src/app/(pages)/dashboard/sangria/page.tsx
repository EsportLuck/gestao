import React, { FC } from "react";

import { CobrancaReportTable } from "@/components/template";
import { TitlePage } from "@/components/TitlePage";

const Sangria: FC = () => {
  return (
    <main className="">
      <TitlePage title="Sangria" />
      <CobrancaReportTable />
    </main>
  );
};

export default Sangria;
