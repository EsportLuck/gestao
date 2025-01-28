import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const HOME = "/";

const DASHBOARD = "/dashboard";
const admRoutes = ["/dashboard/register"];
const supervisorRoutes = ["/dashboard", `/dashboard/extrato`, "/"];

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const sendToDashboard = () =>
    NextResponse.redirect(new URL(DASHBOARD, request.url));
  const sendToHome = () => NextResponse.redirect(new URL(HOME, request.url));
  if (
    token?.role === "supervisor" &&
    !supervisorRoutes.includes(request.nextUrl.pathname)
  )
    return sendToDashboard();
  if (!token && request.nextUrl.pathname !== HOME) return sendToHome();
  if (token && request.nextUrl.pathname === HOME) return sendToDashboard();
  if (
    token?.role !== "administrador" &&
    admRoutes.includes(request.nextUrl.pathname)
  ) {
    return sendToDashboard();
  }
}

export const config = {
  matcher: ["/", "/dashboard", "/dashboard/:path*"],
};
