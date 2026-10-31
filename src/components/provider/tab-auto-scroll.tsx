"use client";

import { useEffect, useRef, type ReactNode } from "react";

type TabAutoScrollProps = {
  activeKey: string;
  children: ReactNode;
};

export function TabAutoScroll({ activeKey, children }: TabAutoScrollProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const list = wrapper.querySelector<HTMLElement>("[data-tab-scroll]");
    const active = wrapper.querySelector<HTMLElement>('[aria-current="page"]');
    if (!list || !active) return;

    const listRect = list.getBoundingClientRect();
    const activeRect = active.getBoundingClientRect();
    const overflowLeft = activeRect.left < listRect.left;
    const overflowRight = activeRect.right > listRect.right;

    if (!overflowLeft && !overflowRight) return;

    const centered =
      list.scrollLeft +
      (activeRect.left - listRect.left) -
      (listRect.width - activeRect.width) / 2;

    list.scrollLeft = Math.max(0, centered);
  }, [activeKey]);

  return <div ref={wrapperRef}>{children}</div>;
}
