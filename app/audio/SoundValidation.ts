export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export function validateSoundUsage(soundPath: string, usage: string): ValidationResult {
  // ... (validation logic)
  return {
    isValid: true,
    errors: [],
    warnings: []
  };
} 