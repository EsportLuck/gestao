import { SupervisorController } from "@/app/api/controller";
import { InternalServerError } from "@/domain/errors";

import { NextRequest, NextResponse } from "next/server";

export const revalidate = 0;

export async function PATCH(
  req: NextRequest,
  _res: NextResponse,
): Promise<void | Response> {
  const data = await req.json();

  try {
    const supervisor = new SupervisorController();
    await supervisor.update(data.id, data);

    return NextResponse.json({ status: 200 });
  } catch (error: any) {
    const internalServerError = new InternalServerError(error);
    return NextResponse.json(
      { error: internalServerError.message },
      { status: internalServerError.statusCode },
    );
  }
}
