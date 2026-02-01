import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FAQ {
  question: string;
  answer: string;
}

const FAQS: FAQ[] = [
  {
    question: 'How much time should I set aside for each interview?',
    answer:
      'Each interview session runs for 25-30 minutes, similar to actual screening rounds',
  },
  {
    question: 'Can I practice the same interview multiple times?',
    answer:
      'Absolutely. Each interview has 5-10 unique problem scenarios, so you will get fresh challenges with every attempt',
  },
  {
    question: 'Is this a video interview or audio-only?',
    answer: 'Currently, all interviews are audio-only',
  },
  {
    question: 'When will I get my performance feedback?',
    answer:
      'Your detailed evaluation is ready in just 1-2 minutes after completing the interview',
  },
  {
    question: 'How much does Primed cost?',
    answer:
      "It's free. We are focused on making the best interview prep tool possible before thinking about monetization",
  },
];

export function FAQSection() {
  const [expandedIndex, setExpandedIndex] = useState<number>(0);

  const toggleFAQ = (index: number) => {
    setExpandedIndex(expandedIndex === index ? -1 : index);
  };

  return (
    <section className="pt-20 md:pt-32 pb-12 md:pb-20 px-4 md:px-6">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8 md:mb-12 text-center">
          Frequently Asked Questions
        </h2>

        <div className="space-y-3 md:space-y-4">
          {FAQS.map((faq, index) => (
            <div
              key={index}
              className="border border-gray-800 bg-black/40 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:border-gray-700"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-4 md:px-6 py-4 md:py-5 flex items-center justify-between text-left touch-manipulation min-h-[64px] md:min-h-[72px] transition-colors duration-200 hover:bg-white/5"
                aria-expanded={expandedIndex === index}
              >
                <span className="text-base md:text-lg font-medium pr-4">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 md:w-6 md:h-6 flex-shrink-0 transition-transform duration-300 ${
                    expandedIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ${
                  expandedIndex === index
                    ? 'max-h-96 opacity-100'
                    : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-4 md:px-6 pb-4 md:pb-5 pt-2">
                  <p className="text-sm md:text-base text-gray-400 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
