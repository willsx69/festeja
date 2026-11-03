import Link from "next/link";
import { MapPin } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Container } from "@/components/ui/container";
import { site } from "@/lib/site";

const columns = [
  {
    title: "Descubra",
    links: [
      { label: "Buscar profissionais", href: "/buscar" },
      { label: "Categorias", href: "/#categorias" },
      { label: "Destaques", href: "/#destaques" },
      { label: "Como funciona", href: "/#como-funciona" },
    ],
  },
  {
    title: "Profissionais",
    links: [
      { label: "Criar perfil grátis", href: "/cadastro?tipo=prestador" },
      { label: "Entrar no painel", href: "/painel" },
      { label: "Vantagens", href: "/#para-prestadores" },
    ],
  },
  {
    title: "Informações",
    links: [
      { label: "Dúvidas frequentes", href: "/#duvidas" },
      { label: "Entrar", href: "/entrar" },
      { label: "Termos de uso", href: "/termos" },
      { label: "Privacidade", href: "/privacidade" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-ink text-white">
      <Container className="py-14 sm:py-18">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Logo tone="white" size="md" />
            <p className="mt-5 max-w-sm text-sm leading-7 text-white/65">
              Conectando quem organiza eventos a profissionais que fazem a festa acontecer em Manaus.
            </p>
            <p className="mt-5 flex items-center gap-2 text-sm font-semibold text-white/80">
              <MapPin className="size-4 text-yellow" aria-hidden="true" />
              Manaus, Amazonas
            </p>
          </div>

          {columns.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <h2 className="text-xs font-extrabold uppercase tracking-[0.16em] text-white">
                {column.title}
              </h2>
              <ul className="mt-5 space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      prefetch={false}
                      className="text-sm text-white/60 transition-colors hover:text-yellow"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-white/45">© {site.year} Festeja. Todos os direitos reservados.</p>
          <p className="text-xs text-white/45">{site.slogan}.</p>
        </div>
      </Container>
    </footer>
  );
}
