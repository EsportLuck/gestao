import { NextResponse } from "next/server";

export async function GET(request: Request) {
  return new NextResponse(null, {
    status: 200,
    statusText: "OK",
  });
}
