// Updated Stepper.tsx
import React from 'react';
import styles from './Stepper.module.css';
import { useStepper, type StepperStep } from '../../context/StepperContext';


const Stepper: React.FC = () => {
  const { currentStep, completedSteps } = useStepper();

  const steps: { key: StepperStep; label: string }[] = [
    { key: 'booking', label: 'Booking details' },
    { key: 'your_details', label: 'Your details' },
    { key: 'payment', label: 'Payment' }
  ];

  const getStepStatus = (stepKey: StepperStep) => {
    if (stepKey === currentStep) return 'active';
    if (completedSteps.includes(stepKey)) return 'completed';
    return 'inactive';
  };

  return (
    <div className={styles.stepper}>
      {steps.map((step, index) => (
        <div key={step.key} className={styles.step}>
          <div className={styles.stepContent}>
            <div
              className={`${styles.stepCircle} ${
                styles[getStepStatus(step.key)]
              }`}
            >
              {completedSteps.includes(step.key) ? (
                <span className={styles.checkmark}>✓</span>
              ) : (
                <span className={styles.stepNumber}>{index + 1}</span>
              )}
            </div>
            <span className={`${styles.stepLabel} ${
              styles[getStepStatus(step.key)]
            }`}>
              {step.label}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`${styles.connector} ${
                completedSteps.includes(step.key) ? styles.completed : ''
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default Stepper;