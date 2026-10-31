"use client";

import { useLayoutEffect } from "react";

let introPlayed = false;

export function HeroIntro() {
  useLayoutEffect(() => {
    const root = document.documentElement;

    if (root.dataset.heroIntro === "run") {
      introPlayed = true;
      return;
    }

    if (introPlayed) return;

    introPlayed = true;
    root.dataset.heroIntro = "run";

    window.setTimeout(() => {
      if (root.dataset.heroIntro === "run") {
        root.dataset.heroIntro = "done";
      }
    }, 1200);
  }, []);

  return null;
}
