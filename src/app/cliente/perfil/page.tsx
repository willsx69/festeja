import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";

export default async function ClientePerfilPage() {
  await requireUser(["cliente"], "/cliente/perfil");
  redirect("/configuracoes#dados-pessoais");
}
