import { NextResponse } from "next/server";
import { getVerifiedCurrentUser } from "@/lib/auth";
import {
  getConversationForUser,
  listMessages,
  markConversationRead,
} from "@/lib/db";

export const instant = false;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getVerifiedCurrentUser();
  if (!user || (user.role !== "cliente" && user.role !== "prestador")) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const { id } = await params;
  const conversation = await getConversationForUser(id, user.id);
  if (!conversation) {
    return NextResponse.json({ error: "Conversa não encontrada." }, { status: 404 });
  }

  await markConversationRead(id, user.id);
  const messages = await listMessages(id);

  return NextResponse.json({ conversation, messages });
}
