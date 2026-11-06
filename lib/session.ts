import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";

export async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return null;
  return session;
}

export function unauthorized() {
  return NextResponse.json({ error: "Login admin diperlukan." }, { status: 401 });
}
