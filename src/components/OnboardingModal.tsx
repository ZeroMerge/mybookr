import React, { useState } from 'react';
import { Button } from './ui/button';
import {
  SolidArrowRight,
  SolidArrowLeft,
  SolidZap,
  SolidUsers,
  SolidLock,
  SolidShieldCheck,
} from './ui/icons';

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: (mode: 'local' | 'cloud') => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onComplete }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  if (!isOpen) return null;

  const slides = [
    {
      title: 'Log sales in seconds.',
      subtitle: 'Fast, simple, and 100% offline.',
      illustration: (
        <div className="w-24 h-24 rounded-3xl bg-[#0f382c] flex items-center justify-center mx-auto">
          <SolidZap className="w-10 h-10 text-[#e4f576]" />
        </div>
      ),
    },
    {
      title: 'Track who owes you.',
      subtitle: 'Never lose money to forgotten debt.',
      illustration: (
        <div className="w-24 h-24 rounded-3xl bg-amber-600 flex items-center justify-center mx-auto">
          <SolidUsers className="w-10 h-10 text-white" />
        </div>
      ),
    },
    {
      title: 'Protect your profit.',
      subtitle: 'Keep stock money separate from daily spending.',
      illustration: (
        <div className="w-24 h-24 rounded-3xl bg-[#0f382c] flex items-center justify-center mx-auto">
          <SolidLock className="w-10 h-10 text-[#e4f576]" />
        </div>
      ),
    },
  ];

  const handleNext = () => {
    if (currentSlide < 3) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#FAF9F6] p-6 overflow-y-auto">
      <div className="max-w-sm w-full min-h-[440px] flex flex-col justify-between py-6">
        
        {/* Top Header: Pure Wordmark Logo on Left, Skip on Right */}
        <div className="flex items-center justify-between">
          <img
            src="/bookr-logo.png"
            alt="BOOKR"
            className="h-6 w-auto object-contain select-none"
          />

          {currentSlide < 3 && (
            <button
              onClick={() => setCurrentSlide(3)}
              className="text-xs font-semibold text-[#5e6b64] hover:text-[#18241f] px-3 py-1 rounded-full hover:bg-black/[0.04] cursor-pointer transition-colors"
            >
              Skip
            </button>
          )}
        </div>

        {/* Center Card Content */}
        {currentSlide < 3 ? (
          <div className="my-auto py-8 text-center space-y-6 animate-in fade-in duration-200">
            {slides[currentSlide].illustration}

            <div className="space-y-2">
              <h2 className="text-2xl font-black text-[#18241f] tracking-tight">
                {slides[currentSlide].title}
              </h2>
              <p className="text-sm text-[#5e6b64] font-medium max-w-xs mx-auto">
                {slides[currentSlide].subtitle}
              </p>
            </div>
          </div>
        ) : (
          /* Step 4: Ready to Start */
          <div className="my-auto py-8 text-center space-y-6 animate-in fade-in duration-200">
            <div className="w-24 h-24 rounded-3xl bg-[#0f382c] flex items-center justify-center mx-auto">
              <SolidShieldCheck className="w-10 h-10 text-[#e4f576]" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-black text-[#18241f] tracking-tight">
                Private & Offline
              </h2>
              <p className="text-sm text-[#5e6b64] font-medium max-w-xs mx-auto">
                All your records stay saved directly on this phone. No sign-up required.
              </p>
            </div>
          </div>
        )}

        {/* Bottom Navigation */}
        <div className="space-y-4">
          {/* Slide Indicator Dots */}
          <div className="flex items-center justify-center gap-2">
            {[0, 1, 2, 3].map((idx) => (
              <span
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  currentSlide === idx
                    ? 'w-6 bg-[#0f382c]'
                    : 'w-1.5 bg-black/[0.15]'
                }`}
              />
            ))}
          </div>

          {/* Action Button */}
          {currentSlide < 3 ? (
            <div className="flex items-center gap-2">
              {currentSlide > 0 && (
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={handlePrev}
                  className="px-4"
                >
                  <SolidArrowLeft className="w-4 h-4" />
                </Button>
              )}
              <Button
                variant="primary"
                size="lg"
                onClick={handleNext}
                className="flex-1 justify-center"
              >
                <span>Continue</span>
                <SolidArrowRight className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <Button
              variant="primary"
              size="lg"
              onClick={() => onComplete('local')}
              className="w-full justify-center text-sm font-bold"
            >
              Get Started
            </Button>
          )}
        </div>

      </div>
    </div>
  );
};
