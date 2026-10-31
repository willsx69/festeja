import { CategoriesSection } from "@/components/home/categories-section";
import { FeaturedProviders } from "@/components/home/featured-providers";
import { Faq } from "@/components/home/faq";
import { Hero } from "@/components/home/hero";
import { HowItWorks } from "@/components/home/how-it-works";
import { ProviderCta } from "@/components/home/provider-cta";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";

export default function Home() {
  return (
    <div className="flex min-h-dvh flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <CategoriesSection />
        <FeaturedProviders />
        <HowItWorks />
        <ProviderCta />
        <Faq />
      </main>
      <Footer />
    </div>
  );
}
