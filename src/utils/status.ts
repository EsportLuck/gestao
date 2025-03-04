export const getStatusIcon = (status: string): string => {
  const icons = {
    ativo: " 🟢",
    inativo: " 🔴",
  };
  return icons[status?.toLowerCase() as keyof typeof icons] || "";
};
