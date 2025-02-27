import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export function useImportForm() {
  const form = useForm<TImportFormSchema>({
    resolver: zodResolver(ImportFormSchema),
    mode: "onChange",
  });

  const [isImporting, setIsImporting] = useState(false);

  const handleImport = async (data: TImportFormSchema) => {
    setIsImporting(true);
    try {
      // Import logic here
    } catch (error) {
      // Error handling
    } finally {
      setIsImporting(false);
    }
  };

  return {
    form,
    isImporting,
    handleImport,
  };
}
