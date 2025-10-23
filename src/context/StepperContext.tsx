// StepperContext.tsx
import React, { createContext, useContext, useState } from 'react';

export type StepperStep = 'booking'| 'review' | 'your_details' | 'payment';

interface StepperContextType {
  currentStep: StepperStep;
  setCurrentStep: (step: StepperStep) => void;
  completedSteps: StepperStep[];
  markStepCompleted: (step: StepperStep) => void;
}

const StepperContext = createContext<StepperContextType | undefined>(undefined);

export const StepperProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentStep, setCurrentStep] = useState<StepperStep>('booking');
  const [completedSteps, setCompletedSteps] = useState<StepperStep[]>([]);

  const markStepCompleted = (step: StepperStep) => {
    setCompletedSteps(prev => {
      if (!prev.includes(step)) {
        return [...prev, step];
      }
      return prev;
    });
  };

  return (
    <StepperContext.Provider value={{
      currentStep,
      setCurrentStep,
      completedSteps,
      markStepCompleted
    }}>
      {children}
    </StepperContext.Provider>
  );
};

export const useStepper = () => {
  const context = useContext(StepperContext);
  if (context === undefined) {
    throw new Error('useStepper must be used within a StepperProvider');
  }
  return context;
};