import { InternalServerError } from "@/domain/errors";
import { prisma } from "@/services/prisma";
import { NextResponse } from "next/server";

export const revalidate = 0;

export async function GET(): Promise<void | Response> {
  try {
    const companies = await prisma.companies.findMany({
      select: {
        parent_companies: {
          select: {
            id: true,
            name: true,
          },
          orderBy: { name: "asc" },
        },
      },
    });
    const data = companies[0].parent_companies.map((company) => {
      return {
        id: company.id,
        name: company.name,
      };
    });
    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    const internalServerError = new InternalServerError(error);
    return NextResponse.json(
      { error: internalServerError.message },
      { status: internalServerError.statusCode },
    );
  }
}
