import React, { FC } from "react";

import { CobrancaReportTable } from "@/components/template";
import { TitlePage } from "@/components/TitlePage";

const DepositoOrNegativos: FC = () => {
  const date = new Date();
  return (
    <main className="">
      <TitlePage title={`${date.getDay() === 1 ? "Negativos" : "Deposito"}`} />
      <CobrancaReportTable />
    </main>
  );
};

export default DepositoOrNegativos;
