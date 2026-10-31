"use client";

import { useEffect } from "react";
import { recordProfileViewAction } from "@/actions/profile";

export function ProfileViewTracker({ username }: { username: string }) {
  useEffect(() => {
    void recordProfileViewAction(username);
  }, [username]);

  return null;
}
