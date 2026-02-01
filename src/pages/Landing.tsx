import { HeroSection } from './landing/HeroSection';
// import { InterviewTypesSection } from './landing/InterviewTypesSection'; // Commented out for pre-launch
import { FeaturesSection } from './landing/FeaturesSection';
import { FAQSection } from './landing/FAQSection';
import { CTASection } from './landing/CTASection';

export function Landing() {
  return (
    <>
      <HeroSection />
      {/* InterviewTypesSection - Commented out for pre-launch (video samples section) */}
      {/* <InterviewTypesSection /> */}
      <FeaturesSection />
      <FAQSection />
      <CTASection />
    </>
  );
}
