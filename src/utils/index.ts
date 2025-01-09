export const numberFormater = (number: number) => {
  const formattedNumber = new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 2,
    style: "currency",
    currency: "BRL",
  }).format(number);
  return formattedNumber;
};

export const sumArr = (arr: { value: number }[]): number => {
  if (arr.length === 0) return 0;
  if (arr.length === 1) return arr[0].value;
  const sum = arr.reduce((acc, curr) => acc + curr.value, 0);
  return sum;
};

export const format = (data: Date) => {
  const transformToDate = new Date(data);

  return transformToDate.toLocaleDateString("pt-BR");
};

export const seNaoExistiValorRetornarZero = (value: any): number => {
  if (value === null || value === undefined) return 0;
  return value;
};

export const tornarPrimeiraLetraMaiuscula = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};
