import { getServerLanguage } from "@/src/utils/getServerLanguage";
import {
  AboutSection,
  ContactSection,
  HeroSection,
  OfferBanner,
  ReviewsSection,
  TrustSection,
} from "@/src/components/HomeSections";
import {
  CategorySection,
  FeaturedProducts,
} from "@/src/components/HomeProductSections";

export default async function Home() {
  const language = await getServerLanguage();

  return (
    <>
      <HeroSection language={language} />
      <CategorySection language={language} />
      <FeaturedProducts language={language} />
      <OfferBanner language={language} />
      <FeaturedProducts language={language} newest />
      <TrustSection language={language} />
      <ReviewsSection language={language} />
      <AboutSection language={language} />
      <ContactSection language={language} />
    </>
  );
}
