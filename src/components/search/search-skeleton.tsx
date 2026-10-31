import { Container } from "@/components/ui/container";

const cards = [0, 1, 2, 3, 4, 5];

export function SearchSkeleton() {
  return (
    <>
      <section className="border-b border-line bg-canvas">
        <Container className="py-8 sm:py-10">
          <div className="h-8 w-56 max-w-full animate-pulse rounded-lg bg-surface-muted" />
          <div className="mt-3 h-4 w-80 max-w-full animate-pulse rounded bg-surface-muted" />
          <div className="mt-6 h-14 w-full animate-pulse rounded-2xl bg-surface-muted sm:rounded-full" />
        </Container>
      </section>

      <section className="bg-surface py-8 sm:py-10">
        <Container>
          <div className="lg:grid lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-8">
            <div className="h-80 animate-pulse rounded-2xl bg-surface-muted" />
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:mt-0 xl:grid-cols-3">
              {cards.map((card) => (
                <div key={card} className="h-72 animate-pulse rounded-2xl bg-surface-muted" />
              ))}
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
