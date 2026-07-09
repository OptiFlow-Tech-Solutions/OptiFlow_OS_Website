import useScrollReveal from '../hooks/useScrollReveal';
import HomeStyles from '../components/HomeStyles';
import HeroSection from '../components/sections/HeroSection';
import TrustBar from '../components/sections/TrustBar';
import ProblemSection from '../components/sections/ProblemSection';
import CostOfInaction from '../components/sections/CostOfInaction';
import SolutionFlow from '../components/sections/SolutionFlow';
import ProductSnapshot from '../components/sections/ProductSnapshot';
import HowItWorks from '../components/sections/HowItWorks';
import FeatureSection from '../components/sections/FeatureSection';
import IndustrySection from '../components/sections/IndustrySection';
import WhyOptiflowComparison from '../components/sections/WhyOptiflowComparison';
import TestimonialSection from '../components/sections/TestimonialSection';
import CTASection from '../components/sections/CTASection';
import FAQPreview from '../components/sections/FAQPreview';
import ExitOverlay from '../components/ExitOverlay';
import WhatsAppFloat from '../components/WhatsAppFloat';

export default function Home() {
  useScrollReveal();

  return (
    <>
      <HomeStyles />
      <HeroSection />
      <TrustBar />
      <ProblemSection />
      <CostOfInaction />
      <SolutionFlow />
      <ProductSnapshot />
      <HowItWorks />
      <FeatureSection />
      <IndustrySection />
      <WhyOptiflowComparison />
      <TestimonialSection />
      <CTASection />
      <FAQPreview />
      <ExitOverlay />
      <WhatsAppFloat />
    </>
  );
}
