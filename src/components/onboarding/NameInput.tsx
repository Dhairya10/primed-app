interface NameInputProps {
  firstName: string;
  lastName: string;
  onFirstNameChange: (value: string) => void;
  onLastNameChange: (value: string) => void;
  firstNameError?: string;
  lastNameError?: string;
}

export function NameInput({
  firstName,
  lastName,
  onFirstNameChange,
  onLastNameChange,
  firstNameError,
  lastNameError,
}: NameInputProps) {
  return (
    <div className="space-y-4">
      {/* First Name Input */}
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
          onChange={(e) => onFirstNameChange(e.target.value)}
          autoComplete="given-name"
          required
          className={`
            w-full px-4 py-3 bg-transparent
            border rounded
            text-white placeholder:text-white/40
            focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-transparent
            transition-all duration-200
            min-h-[44px]
            ${
              firstNameError
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

      {/* Last Name Input */}
      <div className="space-y-1.5">
        <label
          htmlFor="lastName"
          className="block text-sm font-medium text-white"
        >
          Last Name <span className="text-white/40">(Optional)</span>
        </label>
        <input
          id="lastName"
          type="text"
          value={lastName}
          onChange={(e) => onLastNameChange(e.target.value)}
          autoComplete="family-name"
          className={`
            w-full px-4 py-3 bg-transparent
            border rounded
            text-white placeholder:text-white/40
            focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-transparent
            transition-all duration-200
            min-h-[44px]
            ${
              lastNameError
                ? 'border-white/80 ring-2 ring-white/20'
                : 'border-white/30 hover:border-white/50'
            }
          `}
          placeholder="Doe"
          aria-invalid={!!lastNameError}
          aria-describedby={lastNameError ? 'lastName-error' : undefined}
        />
        {lastNameError && (
          <p
            id="lastName-error"
            className="text-sm text-white/80 flex items-center"
          >
            {lastNameError}
          </p>
        )}
      </div>
    </div>
  );
}
