import React from "react";
import * as XLSX from "xlsx";
import { Table2 } from "lucide-react";

interface ExportExcelProps {
  data: any; // Define os dados como uma lista de objetos
}

const ExportExcel: React.FC<ExportExcelProps> = ({ data }) => {
  const handleExport = () => {
    if (!data || data.length === 0) {
      console.error("Nenhum dado disponível para exportação.");
      return;
    }
    const formatarDados = data.map((item: any) => {
      return {
        estabelecimento: item.estabelecimento,
        caixa: item.caixa,
      };
    });
    const worksheet = XLSX.utils.json_to_sheet(formatarDados);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Dados");
    XLSX.writeFile(workbook, "dados.xlsx");
  };

  return (
    <div>
      <button onClick={handleExport} aria-label="Exportar dados para Excel">
        <Table2 size={24} color="green" />
      </button>
    </div>
  );
};

export default ExportExcel;
