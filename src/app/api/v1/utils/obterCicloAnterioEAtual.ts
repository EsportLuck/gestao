export function obterCicloAnterioEAtual(dataInformada: Date): {
  inicioDoCicloAnterior: Date;
  finalDoCiclo: Date;
} {
  const data = new Date(dataInformada);
  const diaDaSemana = data.getUTCDay();

  let dataDedomingo = 0;

  const diasDesdeOInicioDoCiclo =
    diaDaSemana === dataDedomingo ? 6 : diaDaSemana - 1;
  const retornarParaSegunda = data.setUTCDate(
    data.getUTCDate() - diasDesdeOInicioDoCiclo,
  );
  let segundaFeira = new Date(retornarParaSegunda);
  let dataParaCalcularDomingo = new Date(segundaFeira).setUTCDate(
    segundaFeira.getUTCDate() + 6,
  );
  let retornarParaSegundaPassada = segundaFeira.setUTCDate(
    segundaFeira.getUTCDate() - 7,
  );
  let segundaFeiraPassada = new Date(retornarParaSegundaPassada);

  dataParaCalcularDomingo;

  let domingo = new Date(dataParaCalcularDomingo);
  let inicioDoCicloAnterior = new Date(
    segundaFeiraPassada.setUTCHours(0, 0, 0, 0),
  );
  let finalDoCiclo = domingo;
  return { inicioDoCicloAnterior, finalDoCiclo };
}
