export function formatarData(dataISO: string): Date {
  const dataCorreta = dataISO.replace(/T\d{2}:\d{2}:\d{2}\.\d{3}Z/, "");
  const separarDados = dataCorreta.split("-");
  const dia = Number(separarDados[2]);
  const mes = Number(separarDados[1]);
  const ano = Number(separarDados[0]);
  return new Date(ano, mes - 1, dia, 0, 0, 0);
}
