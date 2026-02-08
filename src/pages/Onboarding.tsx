import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
// COMMENTED OUT: NameInput no longer used - first name field inlined
// import { NameInput } from '@/components/onboarding/NameInput';
// COMMENTED OUT: Discipline selection removed from onboarding flow
// import { DisciplineSelector } from '@/components/onboarding/DisciplineSelector';
import { Button } from '@/components/ui/Button';
// COMMENTED OUT: Discipline selection removed from onboarding flow
// import { ONBOARDING_DISCIPLINES } from '@/lib/constants';
import { updateUserProfile } from '@/lib/api';
import { useAuthStore } from '@/lib/auth-store';
// COMMENTED OUT: Discipline selection removed from onboarding flow
// import type { DisciplineType } from '@/types/api';

export function Onboarding() {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuthStore();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState(''); // Still used for backend, hidden from UI
  // COMMENTED OUT: Discipline selection removed from onboarding flow
  // const [selectedDiscipline, setSelectedDiscipline] = useState<DisciplineType | null>(null);
  // const [disciplines] = useState<DisciplineType[]>(ONBOARDING_DISCIPLINES);
  const [loading, setLoading] = useState(false);

  // Validation errors
  const [firstNameError, setFirstNameError] = useState('');
  // COMMENTED OUT: Discipline selection removed from onboarding flow
  // const [disciplineError, setDisciplineError] = useState('');

  // Pre-fill name from user profile (e.g., from Google OAuth)
  useEffect(() => {
    if (user) {
      if (user.first_name) {
        setFirstName(user.first_name);
      }
      if (user.last_name) {
        setLastName(user.last_name);
      }
    }
  }, [user]);

  // Validate first name
  const validateFirstName = (value: string): boolean => {
    if (!value.trim()) {
      setFirstNameError('First name is required');
      return false;
    }
    if (value.trim().length < 2) {
      setFirstNameError('First name must be at least 2 characters');
      return false;
    }
    if (!/^[a-zA-Z\s-']+$/.test(value)) {
      setFirstNameError('First name can only contain letters, spaces, hyphens, and apostrophes');
      return false;
    }
    setFirstNameError('');
    return true;
  };

  // COMMENTED OUT: Discipline selection removed from onboarding flow
  // // Validate discipline
  // const validateDiscipline = (): boolean => {
  //   if (!selectedDiscipline) {
  //     setDisciplineError('Please select your primary focus');
  //     return false;
  //   }
  //   setDisciplineError('');
  //   return true;
  // };

  // Handle first name change
  const handleFirstNameChange = (value: string) => {
    setFirstName(value);
    if (firstNameError) {
      validateFirstName(value);
    }
  };

  // COMMENTED OUT: Discipline selection removed from onboarding flow
  // // Handle discipline change
  // const handleDisciplineChange = (discipline: DisciplineType) => {
  //   setSelectedDiscipline(discipline);
  //   setDisciplineError('');
  // };

  const handleContinue = async () => {
    // Validate all fields
    const isFirstNameValid = validateFirstName(firstName);
    // COMMENTED OUT: Discipline selection removed from onboarding flow
    // const isDisciplineValid = validateDiscipline();

    if (!isFirstNameValid) {
      return;
    }

    // Check if user is authenticated
    if (!user) {
      console.error('No authenticated user found');
      navigate({ to: '/login', replace: true });
      return;
    }

    setLoading(true);
    try {
      // Update user profile with onboarding data
      // Note: discipline field omitted - backend will default to 'product'
      await updateUserProfile(user.id, {
        first_name: firstName.trim(),
        last_name: lastName.trim() || undefined,
        onboarding_completed: true,
      });

      // Refresh user profile in auth store to update onboarding_completed flag
      await refreshUser();

      // Navigate to home page after successful submission
      navigate({ to: '/home' });
    } catch (error) {
      console.error('Failed to update user profile:', error);
      // For MVP, still navigate on error
      navigate({ to: '/home' });
    } finally {
      setLoading(false);
    }
  };

  // UPDATED: Only validate first name, discipline removed from onboarding
  const canContinue = firstName.trim().length >= 2;

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 md:p-6">
      <div className="w-full max-w-md mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            Welcome to Primed
          </h1>
          <p className="text-white/60 text-base md:text-lg">
            Let's set up your profile
          </p>
        </div>

        {/* Form Content */}
        <div className="space-y-8">
          {/* Name Input - Only First Name shown in UI */}
          <div className="space-y-1.5">
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-white"
            >
              First Name <span className="text-white/60">*</span>
            </label>
            <input
              id="firstName"
              type="text"
              value={firstName}
              onChange={(e) => handleFirstNameChange(e.target.value)}
              autoComplete="given-name"
              required
              className={`
                w-full px-4 py-3 bg-transparent
                border rounded
                text-white placeholder:text-white/40
                focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-transparent
                transition-all duration-200
                min-h-[44px]
                ${firstNameError
                  ? 'border-white/80 ring-2 ring-white/20'
                  : 'border-white/30 hover:border-white/50'
                }
              `}
              placeholder="John"
              aria-invalid={!!firstNameError}
              aria-describedby={firstNameError ? 'firstName-error' : undefined}
            />
            {firstNameError && (
              <p
                id="firstName-error"
                className="text-sm text-white/80 flex items-center"
              >
                {firstNameError}
              </p>
            )}
          </div>

          {/* COMMENTED OUT: Discipline selection removed from onboarding flow */}
          {/* <DisciplineSelector
            disciplines={disciplines}
            selectedDiscipline={selectedDiscipline}
            onDisciplineChange={handleDisciplineChange}
            error={disciplineError}
          /> */}
        </div>

        {/* Continue Button */}
        <div className="flex justify-center pt-4">
          <Button
            variant="primary"
            size="lg"
            onClick={handleContinue}
            disabled={!canContinue || loading}
            loading={loading}
            className="min-w-[200px]"
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
