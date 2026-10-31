import type { ReactNode } from "react";
import { requireUser } from "@/lib/auth";

export const instant = false;

export default async function AdminLayout({ children }: { children: ReactNode }) {
  await requireUser(["admin"]);
  return children;
}
