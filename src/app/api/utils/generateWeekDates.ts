type WeekDay =
  | "segunda"
  | "terca"
  | "quarta"
  | "quinta"
  | "sexta"
  | "sabado"
  | "domingo";
type WeekDates = Record<WeekDay, Date>;

export function generateWeekDates(startDate: Date): WeekDates {
  const weekDays = [
    "segunda",
    "terca",
    "quarta",
    "quinta",
    "sexta",
    "sabado",
    "domingo",
  ] as const;

  const result = weekDays.reduce<Record<WeekDay, Date>>(
    (acc, day, index) => {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + index);
      date.setUTCHours(0, 0, 0, 0);
      acc[day] = date;
      return acc;
    },
    {} as Record<WeekDay, Date>,
  );

  return result;
}
