import { Container } from "@/components/ui/container";

export function MessagesSkeleton() {
  return (
    <Container className="py-8 sm:py-10">
      <div className="h-9 w-56 animate-pulse rounded-lg bg-surface-muted" />
      <div className="mt-3 h-4 w-80 max-w-full animate-pulse rounded bg-surface-muted" />
      <div className="mt-6 grid gap-5 lg:grid-cols-[20rem_minmax(0,1fr)]">
        <div className="h-[min(70dvh,40rem)] animate-pulse rounded-2xl bg-surface-muted" />
        <div className="h-[min(70dvh,40rem)] animate-pulse rounded-2xl bg-surface-muted" />
      </div>
    </Container>
  );
}
