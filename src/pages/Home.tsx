import { useEffect, useState } from 'react';
import { useNavigate, Link } from '@tanstack/react-router';
import { ArrowRight } from 'lucide-react';
import { RecommendedDrillCard } from '@/components/home/RecommendedDrillCard';
import { getHomeScreenRecommendation, getUserProfile, startDrillSession } from '@/lib/api';
import { DEFAULT_USER_ID, IS_ONBOARDING_ENABLED } from '@/lib/constants';
import type { HomeScreenRecommendation } from '@/types/api';

export function Home() {
  const navigate = useNavigate();
  const [data, setData] = useState<HomeScreenRecommendation | null>(null);
  const [userName, setUserName] = useState('there');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        const [recommendation, profile] = await Promise.all([
          getHomeScreenRecommendation(DEFAULT_USER_ID),
          getUserProfile(DEFAULT_USER_ID),
        ]);

        if (IS_ONBOARDING_ENABLED && !profile.onboarding_completed) {
          navigate({ to: '/onboarding' });
          return;
        }

        if (!isMounted) return;

        setData(recommendation);
        setUserName(profile.first_name?.trim() || 'there');
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

  const handleDrillClick = async () => {
    if (!data) return;

    try {
      const session = await startDrillSession(data.drill.id);
      navigate({ to: `/drill/${session.session_id}` });
    } catch (err) {
      console.error('Failed to start drill:', err);
      setError('Failed to start drill');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white pt-24 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="h-8 w-48 bg-white/10 rounded mb-8 animate-pulse" />
          <div className="h-64 bg-white/10 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-black text-white pt-24 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-white/60">{error || 'No recommendation available'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Hey {userName}</h1>
        </div>

        <RecommendedDrillCard
          drill={{
            id: data.drill.id,
            title: data.drill.title,
            skillsTested: data.drill.skills_tested,
            reasoning: data.drill.reasoning,
            logoUrl: data.drill.product_logo_url,
          }}
          onClick={handleDrillClick}
        />

        <div className="mt-6 text-center">
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
