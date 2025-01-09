import React, { FC } from "react";

interface IProductInfoBox {
  product: string;
  price: number;
}

export const ProductInfoBox: FC<IProductInfoBox> = ({ product, price }) => {
  const priceFormatted = price.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  });
  return (
    <div>
      <h2>{product}</h2>
      <p>
        <span>{priceFormatted}</span>
      </p>
    </div>
  );
};
