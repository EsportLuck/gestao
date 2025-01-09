export function formatNumber(number: string) {
  if (typeof number !== "string") return number;
  const formatterNumber = number
    .replace(/-R\$ /, "-")
    .replace(/R\$/, "")
    .replace(".", "")
    .replace(",", ".")
    .trim();
  return Number(formatterNumber);
}
