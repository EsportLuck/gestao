"use client";
import { FC } from "react";
import { DataTableEstabelecimentos } from "@/components/template";
import { useExtractData } from "@/shared/hooks";
import { DashboardLoading } from "./DashboadLoading";
export const DashboardPage: FC = () => {
  const { data, error, isLoading } = useExtractData();

  if (isLoading) {
    return (
      <main className="flex items-center justify-center min-h-screen">
        <DashboardLoading />
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex items-center justify-center min-h-screen">
        <div>Error loading data. Please try again later.</div>
      </main>
    );
  }

  return (
    <main>
      <DataTableEstabelecimentos data={data?.extrato || []} />
    </main>
  );
};
