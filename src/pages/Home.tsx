import { useEffect, useState } from 'react';
import { useNavigate, Link } from '@tanstack/react-router';
import { ArrowRight } from 'lucide-react';
import { RecommendedDrillCard } from '@/components/home/RecommendedDrillCard';
import { getHomeScreenRecommendation } from '@/lib/api';
import { DEFAULT_USER_ID } from '@/lib/constants';
import type { HomeScreenRecommendation } from '@/types/api';

export function Home() {
  const navigate = useNavigate();
  const [data, setData] = useState<HomeScreenRecommendation | null>(null);
  const [greeting, setGreeting] = useState('Hey there');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        const recommendation = await getHomeScreenRecommendation(DEFAULT_USER_ID);

        if (!isMounted) return;

        setData(recommendation);
        setGreeting(recommendation.greeting);


      } catch (err) {
        console.error(err);
        if (isMounted) {
          setError('Failed to load recommendation');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  const handleDrillClick = () => {
    if (!data) return;
    navigate({ to: `/drill/loading/${data.drill.id}` });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white pt-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="h-8 w-48 bg-white/10 rounded mb-8 animate-pulse" />
          <div className="h-64 bg-white/10 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-black text-white pt-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-white/60">{error || 'No recommendation available'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4 py-20">
      {/* Centered content - greeting, card, and CTA grouped together */}
      <div className="w-full max-w-4xl space-y-8">
        {/* Greeting just above card */}
        <h1 className="text-5xl md:text-5xl font-medium text-white text-center">
          {greeting}
        </h1>

        {/* Drill card */}
        <RecommendedDrillCard
          drill={{
            id: data.drill.id,
            title: data.drill.title,
            skillsTested: data.drill.skills_tested,
            reasoning: data.drill.reasoning,
            logoUrl: data.drill.product_logo_url,
          }}
          sessionCount={data.session_count}
          onClick={handleDrillClick}
        />

        {/* CTA just below card */}
        <div className="text-center">
          <Link
            to="/library"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm"
          >
            View all drills
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
