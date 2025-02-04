export function debitOrCredit(
  caixa: number,
  value: number,
  type: "sangria" | "deposito" | "negativo" | "despesa",
  action: "aprovado" | "reprovado",
) {
  const operations = {
    sangria: {
      aprovado: caixa + value,
      reprovado: caixa - value,
    },
    deposito: {
      aprovado: caixa - value,
      reprovado: caixa + value,
    },
    despesa: {
      aprovado: caixa - value,
      reprovado: caixa + value,
    },
    negativo: {
      aprovado: caixa + value,
      reprovado: caixa - value,
    },
  };

  return operations[type][action];
}
