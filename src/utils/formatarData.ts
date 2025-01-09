export function formatarData(dataISO: string): Date {
  const data = new Date(dataISO);

  const day = Number(
    dataISO
      .match(/-\d{2}T/)
      ?.toString()
      .match(/\d{2}/)
      ?.toString(),
  );
  const ano = data.getFullYear();
  const mes = data.getMonth();

  return new Date(ano, mes, day, 0, 0, 0);
}
