export function obterInicioEFimDoCiclo(dataInformada: Date): {
  inicioDoCiclo: Date;
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
  dataParaCalcularDomingo;

  let domingo = new Date(dataParaCalcularDomingo);
  let inicioDoCiclo = segundaFeira;
  let finalDoCiclo = domingo;
  return { inicioDoCiclo, finalDoCiclo };
}
