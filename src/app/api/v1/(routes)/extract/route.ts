import { ExtratoController } from "@/app/api/controller/extrato.controller";
import { NextRequest, NextResponse } from "next/server";

export const revalidate = 0;

export async function GET(req: NextRequest) {
  try {
    const extrato = new ExtratoController();
    const {
      localidade,
      rota,
      secao,
      supervisor,
      estabelecimento: estabelecimentoName,
      role,
      username,
      site,
      empresa,
    } = extrato.obterDadosDoFormulario(req);
    const data = await extrato.obterEstabelecimentosDoBancoDeDados(req);
    const dadosNaoExistem = data?.length === 0;
    if (dadosNaoExistem) {
      return NextResponse.json({ extrato: [] }, { status: 200 });
    }

    const estabelecimentoComMovimentacaoFinanceira = data?.map((dados) => {
      const id = dados.id;
      const status = dados.status_pagamento;
      const estabelecimento = dados.name;
      const vendas = dados.vendas;
      const comissão = dados.comissao;
      const quantidade = dados.quantidade;
      const prêmios = dados.premios;
      const líquido = dados.liquido;
      const deposito = dados.deposito;
      const sangria = dados.sangria;
      const despesas = dados.despesas;
      const caixa = dados.caixa;
      const site = dados.site;
      const empresa = dados.empresa;
      const matrizId = dados.matrizId;
      const supervisor = dados.supervisor ? dados.supervisor : "";
      const localidade = dados.localidade;
      const rota = dados.rota;
      const secao = dados.secao;
      const prestacao = dados.prestacao;
      const negativo = dados.negativo;
      return {
        id,
        status,
        estabelecimento,
        vendas,
        comissão,
        quantidade,
        prêmios,
        líquido,
        deposito,
        sangria,
        despesas,
        caixa,
        site,
        empresa,
        matrizId,
        supervisor,
        localidade,
        rota,
        secao,
        prestacao,
        negativo,
      };
    });

    const somarValoresDasFiliasNaMatriz =
      estabelecimentoComMovimentacaoFinanceira?.map((dado) => {
        const matrizId = dado.id;
        const filial = estabelecimentoComMovimentacaoFinanceira.filter(
          (estabelecimento) => estabelecimento.matrizId === matrizId,
        );
        let totalDeVendas = 0;
        let totalDeComissao = 0;
        let totalDeQuantidade = 0;
        let totalDePremios = 0;
        let totalDeLiquido = 0;
        if (Boolean(filial.length)) {
          filial.map((estabelecimento) => {
            totalDeVendas += estabelecimento.vendas;
            totalDeComissao += estabelecimento.comissão;
            totalDeQuantidade += estabelecimento.quantidade;
            totalDePremios += estabelecimento.prêmios;
            totalDeLiquido += estabelecimento.líquido;
          });

          dado.vendas += totalDeVendas;
          dado.comissão += totalDeComissao;
          dado.quantidade += totalDeQuantidade;
          dado.prêmios += totalDePremios;
          dado.líquido += totalDeLiquido;
        }
        return dado;
      });

    const estabelecimentoMatriz = somarValoresDasFiliasNaMatriz?.filter(
      (estabelecimento) => estabelecimento.matrizId === null,
    );

    const filtarPorTipoDeUsuario = () => {
      if (role === "administrador") {
        return estabelecimentoMatriz;
      }

      if (role === "supervisor") {
        return estabelecimentoMatriz?.filter(
          (estabelecimento) =>
            estabelecimento.supervisor.toLowerCase() === username,
        );
      }

      return estabelecimentoMatriz?.filter(
        (estabelecimento) =>
          estabelecimento.empresa?.toLowerCase() === site?.toLocaleLowerCase(),
      );
    };

    const dadosFiltradosPelosQueOUsuarioPediu = () => {
      let estabelecimentos = filtarPorTipoDeUsuario();
      let supervisorLowerCase = supervisor === "undefined" ? "" : supervisor;
      if (localidade) {
        estabelecimentos = estabelecimentos?.filter(
          (estabelecimento) => estabelecimento.localidade === localidade,
        );
      }
      if (secao) {
        estabelecimentos = estabelecimentos?.filter(
          (estabelecimento) => estabelecimento.secao === secao,
        );
      }
      if (rota) {
        estabelecimentos = estabelecimentos?.filter(
          (estabelecimento) => estabelecimento.rota === rota,
        );
      }
      if (supervisorLowerCase) {
        estabelecimentos = estabelecimentos?.filter(
          (estabelecimento) =>
            estabelecimento.supervisor === supervisorLowerCase,
        );
      }
      if (empresa) {
        estabelecimentos = estabelecimentos?.filter(
          (estabelecimento) =>
            estabelecimento.empresa?.toLowerCase() === empresa.toLowerCase(),
        );
      }
      if (estabelecimentoName) {
        estabelecimentos = estabelecimentos?.filter(
          (estabelecimento) =>
            estabelecimento.id === Number(estabelecimentoName),
        );
      }
      estabelecimentos = estabelecimentos?.filter((estabelecimento) => {
        if (
          estabelecimento.deposito === 0 &&
          estabelecimento.sangria === 0 &&
          estabelecimento.despesas === 0 &&
          estabelecimento.líquido === 0 &&
          estabelecimento.vendas === 0 &&
          estabelecimento.prestacao === 0 &&
          estabelecimento.negativo === 0
        )
          return false;
        return true;
      });
      return estabelecimentos;
    };

    const extratoFinal = dadosFiltradosPelosQueOUsuarioPediu();
    return NextResponse.json({ extrato: extratoFinal }, { status: 200 });
  } catch (error) {
    console.error("extract get", error);
    return NextResponse.json({ status: 500 });
  }
}
