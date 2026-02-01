import { useEffect, useState } from 'react';
import { getProfileScreen } from '@/lib/api';
import type { ProfileScreenResponse } from '@/types/api';

export function Profile() {
  const [profileData, setProfileData] = useState<ProfileScreenResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProfileData() {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getProfileScreen();
        setProfileData(data);
      } catch (err) {
        console.error('Failed to fetch profile data:', err);
        setError('Failed to load profile data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    }

    fetchProfileData();
  }, []);

  const getFullName = () => {
    if (!profileData) return 'User';
    const firstName = profileData.first_name || '';
    const lastName = profileData.last_name || '';
    return `${firstName} ${lastName}`.trim() || 'User';
  };

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-20 md:pb-12 px-4 md:px-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            Profile
          </h1>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-gray-400">Loading profile...</div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-ink-900 border border-red-500/20 p-6 mb-6">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Profile Section */}
        {!isLoading && !error && profileData && (
          <div className="space-y-6">
            {/* User Info Card */}
            <div className="bg-ink-900 border border-white/10 p-6">
              <h2 className="text-xl font-semibold text-white mb-4">
                Account Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Name</label>
                  <p className="text-white">{getFullName()}</p>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Email</label>
                  <p className="text-white">{profileData.email}</p>
                </div>
                {profileData.discipline && (
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">
                      Track
                    </label>
                    <p className="text-white capitalize">
                      {profileData.discipline}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
