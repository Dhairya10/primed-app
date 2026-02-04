import { useState, useEffect, useRef } from 'react';
import { FeatureVisualization } from './FeatureVisualization';

interface Feature {
  title: string;
  description: string;
  visualization: 'feedback' | 'problems' | 'simulation' | 'instant' | 'skill-map';
}

const FEATURES: Feature[] = [
  {
    title: 'Practice with a coach that pushes back',
    description:
      'Real interviewers ask follow-ups, so does Primed. Get probing questions that challenge your reasoning',
    visualization: 'simulation',
  },
  {
    title: 'Get feedback without the fluff',
    description:
      'Honest, detailed evaluation of what worked and what did not. No sugarcoating, no bias.',
    visualization: 'feedback',
  },
  {
    title: 'Prep for top companies',
    description:
      '100+ interview scenarios from companies like Google, Netflix, Airbnb, and more.',
    visualization: 'problems',
  },
  {
    title: 'See yourself improve',
    description:
      'Track your progress across sessions. Know exactly where you stand.',
    visualization: 'skill-map',
  },
];

export function FeaturesSection() {
  const [visibleFeatures, setVisibleFeatures] = useState<number[]>([]);
  const featuresRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      featuresRef.current.forEach((ref, index) => {
        if (ref) {
          const rect = ref.getBoundingClientRect();
          if (rect.top < window.innerHeight * 0.75) {
            setVisibleFeatures((prev) => {
              if (!prev.includes(index)) {
                return [...prev, index];
              }
              return prev;
            });
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="py-12 md:py-20 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="space-y-40 md:space-y-64">
          {FEATURES.map((feature, index) => (
            <div
              key={index}
              ref={(el) => (featuresRef.current[index] = el)}
              className={`
                grid md:grid-cols-2 gap-8 md:gap-12 items-center
                transition-all duration-1000
                ${visibleFeatures.includes(index)
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-10'
                }
              `}
            >
              <div
                className={`text-center md:text-left ${index % 2 === 0 ? 'md:order-1' : 'md:order-2'}`}
              >
                <h3 className="text-3xl md:text-4xl font-bold mb-4">
                  {feature.title}
                </h3>
                <p className="text-base md:text-lg text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>

              <div
                className={`${index % 2 === 0 ? 'md:order-2' : 'md:order-1'}`}
              >
                <FeatureVisualization type={feature.visualization} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
