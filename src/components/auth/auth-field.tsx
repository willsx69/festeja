"use client";

import { useState } from "react";
import { CircleAlert, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

type AuthFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "email" | "password";
  placeholder?: string;
  autoComplete?: string;
  error?: string;
  className?: string;
};

export function AuthField({
  id,
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  autoComplete,
  error,
  className,
}: AuthFieldProps) {
  const [visible, setVisible] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword && visible ? "text" : type;

  return (
    <div className={cn(className)}>
      <label htmlFor={id} className="block text-sm font-medium text-ink">
        {label}
      </label>

      <div className="relative mt-1.5">
        <input
          id={id}
          name={id}
          type={inputType}
          value={value}
          placeholder={placeholder}
          autoComplete={autoComplete}
          onChange={(event) => onChange(event.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-erro` : undefined}
          className={cn(
            "h-11 w-full rounded-xl border bg-surface px-3.5 text-sm text-ink transition-colors placeholder:text-ink-faint focus:border-brand",
            isPassword && "pr-11",
            error ? "border-danger" : "border-line-strong hover:border-brand/50",
          )}
        />

        {isPassword ? (
          <button
            type="button"
            onClick={() => setVisible((current) => !current)}
            aria-label={visible ? "Ocultar senha" : "Mostrar senha"}
            className="absolute right-1.5 top-1/2 inline-flex size-8 -translate-y-1/2 items-center justify-center rounded-lg text-ink-faint transition-colors hover:text-ink"
          >
            {visible ? (
              <EyeOff className="size-4" aria-hidden="true" />
            ) : (
              <Eye className="size-4" aria-hidden="true" />
            )}
          </button>
        ) : null}
      </div>

      {error ? (
        <p
          id={`${id}-erro`}
          className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-danger"
        >
          <CircleAlert className="size-3.5 shrink-0" aria-hidden="true" />
          {error}
        </p>
      ) : null}
    </div>
  );
}
