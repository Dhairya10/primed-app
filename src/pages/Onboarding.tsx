import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { NameInput } from '@/components/onboarding/NameInput';
import { DisciplineSelector } from '@/components/onboarding/DisciplineSelector';
import { Button } from '@/components/ui/Button';
import { ONBOARDING_DISCIPLINES } from '@/lib/constants';
import { updateUserProfile } from '@/lib/api';
import { useAuthStore } from '@/lib/auth-store';
import type { DisciplineType } from '@/types/api';

export function Onboarding() {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuthStore();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [selectedDiscipline, setSelectedDiscipline] = useState<DisciplineType | null>(null);
  const [disciplines] = useState<DisciplineType[]>(ONBOARDING_DISCIPLINES);
  const [loading, setLoading] = useState(false);

  // Validation errors
  const [firstNameError, setFirstNameError] = useState('');
  const [disciplineError, setDisciplineError] = useState('');

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

  // Validate discipline
  const validateDiscipline = (): boolean => {
    if (!selectedDiscipline) {
      setDisciplineError('Please select your primary focus');
      return false;
    }
    setDisciplineError('');
    return true;
  };

  // Handle first name change
  const handleFirstNameChange = (value: string) => {
    setFirstName(value);
    if (firstNameError) {
      validateFirstName(value);
    }
  };

  // Handle discipline change
  const handleDisciplineChange = (discipline: DisciplineType) => {
    setSelectedDiscipline(discipline);
    setDisciplineError('');
  };

  const handleContinue = async () => {
    // Validate all fields
    const isFirstNameValid = validateFirstName(firstName);
    const isDisciplineValid = validateDiscipline();

    if (!isFirstNameValid || !isDisciplineValid) {
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
      await updateUserProfile(user.id, {
        discipline: selectedDiscipline!,
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

  const canContinue = firstName.trim().length >= 2 && selectedDiscipline !== null;

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 md:p-6">
      <div className="w-full max-w-2xl mx-auto space-y-8">
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
          {/* Name Inputs */}
          <NameInput
            firstName={firstName}
            lastName={lastName}
            onFirstNameChange={handleFirstNameChange}
            onLastNameChange={setLastName}
            firstNameError={firstNameError}
          />

          {/* Discipline Selector */}
          <DisciplineSelector
            disciplines={disciplines}
            selectedDiscipline={selectedDiscipline}
            onDisciplineChange={handleDisciplineChange}
            error={disciplineError}
          />
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
