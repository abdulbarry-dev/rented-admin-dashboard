'use client';

import { CheckCircle2 } from 'lucide-react';

interface StepIndicatorProps {
  stepNumber: 1 | 2;
  isActive: boolean;
  isCompleted: boolean;
  label: string;
  sublabel: string;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  stepNumber,
  isActive,
  isCompleted,
  label,
  sublabel,
}) => {
  return (
    <div className="flex items-center gap-3" role="status" aria-live="polite">
      <div
        className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all ${
          isActive || isCompleted
            ? 'border-purple-600 bg-purple-600/10'
            : 'border-gray-600 border-dashed'
        }`}
        aria-label={`Step ${stepNumber}: ${isCompleted ? 'Completed' : isActive ? 'Active' : 'Pending'}`}
      >
        {isCompleted ? (
          <CheckCircle2 className="w-6 h-6 text-purple-500" aria-hidden="true" />
        ) : (
          <span
            className={`text-lg font-semibold ${
              isActive ? 'text-purple-500' : 'text-gray-500'
            }`}
          >
            {stepNumber}
          </span>
        )}
      </div>
      <div>
        <p
          className={`font-semibold ${
            isActive || isCompleted ? 'text-white' : 'text-gray-500'
          }`}
        >
          {label}
        </p>
        <p className="text-sm text-gray-400">{sublabel}</p>
      </div>
    </div>
  );
};

interface StepIndicatorsProps {
  frontCompleted: boolean;
  backCompleted: boolean;
}

export const StepIndicators: React.FC<StepIndicatorsProps> = ({
  frontCompleted,
  backCompleted,
}) => {
  return (
    <div className="flex items-center justify-center gap-6 sm:gap-8 mb-8" role="navigation" aria-label="Upload progress">
      <StepIndicator
        stepNumber={1}
        isActive={!frontCompleted}
        isCompleted={frontCompleted}
        label="Upload document"
        sublabel="front page"
      />

      {/* Connector Line */}
      <div
        className={`h-0.5 w-12 sm:w-16 transition-colors ${
          frontCompleted ? 'bg-purple-600' : 'bg-gray-700'
        }`}
        aria-hidden="true"
      />

      <StepIndicator
        stepNumber={2}
        isActive={frontCompleted && !backCompleted}
        isCompleted={backCompleted}
        label="Upload document"
        sublabel="back page"
      />
    </div>
  );
};
