import { NextResponse } from "next/server";
import { getVerifiedCurrentUser } from "@/lib/auth";
import { listConversationsForUser } from "@/lib/db";

export const instant = false;

export async function GET() {
  const user = await getVerifiedCurrentUser();
  if (!user || (user.role !== "cliente" && user.role !== "prestador")) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const conversations = await listConversationsForUser(user.id);
  return NextResponse.json({ conversations });
}
