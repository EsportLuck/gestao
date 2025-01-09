export function stratigyCash(
  str: string,
  total: number,
  liquido: number,
  subTotal: number,
) {
  switch (str) {
    case "olitec":
      return {
        total: total - liquido,
        value_bicho: subTotal - liquido,
      };
    case "caratec":
      return {
        total: total - liquido,
        value_bicho: subTotal - liquido,
      };
    case "fratec":
      return {
        total: total - liquido,
        value_loteria: subTotal - liquido,
      };
    default:
      return {
        total: total - liquido,
        value_futebol: subTotal - liquido,
      };
  }
}
