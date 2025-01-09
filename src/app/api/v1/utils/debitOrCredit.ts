export function debitOrCredit(
  caixa: number,
  value: number,
  type: "sangria" | "deposito",
  action: "aprovado" | "reprovado",
) {
  if (type === "sangria" && action === "reprovado") {
    return caixa - value;
  }
  if (type === "sangria" && action === "aprovado") {
    return caixa + value;
  }
  if (type === "deposito" && action === "reprovado") {
    return caixa + value;
  }

  if (type === "deposito" && action === "aprovado") {
    return caixa - value;
  }
}
