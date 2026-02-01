export function formatEnumLabel(enumValue: string): string {
  const specialCases: Record<string, string> = {
    behavioural: 'Behavioral',
  };

  const normalized = enumValue.trim();
  if (!normalized) {
    return '';
  }

  if (specialCases[normalized]) {
    return specialCases[normalized];
  }

  return normalized
    .split('_')
    .map((segment) =>
      segment ? segment.charAt(0).toUpperCase() + segment.slice(1).toLowerCase() : segment
    )
    .join(' ');
}

export function shuffleArray<T>(input: T[]): T[] {
  const array = [...input];
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
