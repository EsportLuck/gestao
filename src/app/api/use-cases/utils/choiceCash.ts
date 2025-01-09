export const choiceCash = (value: any, site: string) => {
  if (site === "fratec") {
    return Number(value.value_loteria) || 0;
  }
  if (site === "olitec" || site === "caratec") {
    return Number(value.value_bicho) || 0;
  }

  return value.value_futebol || 0;
};
