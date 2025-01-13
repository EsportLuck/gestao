export function obterDiaAnterior(date: string | Date): {
  startOfDay: Date;
  endOfDay: Date;
} {
  const previousDate = new Date(date);
  previousDate.setDate(previousDate.getDate() - 1);
  const startOfDay = new Date(previousDate);
  const endOfDay = new Date(date);

  return { startOfDay, endOfDay };
}
