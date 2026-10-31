"use server";

import { refresh } from "next/cache";
import { requireUser } from "@/lib/auth";
import { markAllNotificationsRead, markNotificationRead } from "@/lib/db";

export async function markNotificationReadAction(notificationId: string): Promise<void> {
  const user = await requireUser();
  await markNotificationRead(notificationId, user.id);
  refresh();
}

export async function markAllNotificationsReadAction(): Promise<void> {
  const user = await requireUser();
  await markAllNotificationsRead(user.id);
  refresh();
}
