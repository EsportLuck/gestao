export const qualArrayEMaior = <T>(array1: T[], array2: T[]) => {
  if (array1.length === array2.length) return array1;
  return array1.length > array2.length ? array1 : array2;
};
