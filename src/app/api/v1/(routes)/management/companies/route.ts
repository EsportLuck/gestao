import { HttpStatusCode } from "@/domain/enum";
import {
  DatabaseError,
  RecordNotFoundError,
  InternalServerError,
  isAppError,
} from "@/domain/errors";
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
    if (!companies || companies.length === 0) {
      throw new RecordNotFoundError("Companies");
    }
    if (!companies[0].parent_companies?.length) {
      throw new RecordNotFoundError("Parent Companies");
    }

    const data = companies[0].parent_companies.map((company) => {
      return {
        id: company.id,
        name: company.name,
      };
    });
    return NextResponse.json({ matrizes: data }, { status: HttpStatusCode.OK });
  } catch (error: unknown) {
    if (error instanceof RecordNotFoundError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode },
      );
    }
    if (
      error instanceof Error &&
      error.name === "PrismaClientKnownRequestError"
    ) {
      const dbError = new DatabaseError("Database operation failed");
      return NextResponse.json(
        { error: dbError.message },
        { status: dbError.statusCode },
      );
    }
    if (isAppError(error)) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode },
      );
    }
  }
  const internalError = new InternalServerError({
    message: "An unexpected error occurred while fetching companies",
  });

  return NextResponse.json(
    { error: internalError.message },
    { status: internalError.statusCode },
  );
}
