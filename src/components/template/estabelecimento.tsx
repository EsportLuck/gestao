"use client";
import { FC } from "react";
import { ProductInfoBox } from "./product-info-box";
import { Badge } from "@/components/ui";

export const Estabelecimento: FC<{ estabelecimento: string }> = ({
  estabelecimento,
}) => {
  return (
    <li className="" key={estabelecimento}>
      <div className="">
        <span>{estabelecimento}</span>
      </div>
      <div className="">
        <Badge>devendo</Badge>
        <Badge>pago</Badge>
      </div>
      <ProductInfoBox product={"Futebol"} price={0} />
      <ProductInfoBox product={"Jogo do Bicho"} price={0} />
      <ProductInfoBox product={"Loteria"} price={0} />
      <ProductInfoBox product={"Depósito"} price={0} />
      <ProductInfoBox product={"Sangria"} price={0} />
      <ProductInfoBox product={"Despesas"} price={0} />
      <ProductInfoBox product={"Caixa"} price={0} />
    </li>
  );
};
