import React from 'react';
import { Button } from './ui/button';
import { SolidClose, SolidDownload } from './ui/icons';

interface PWAInstallBannerProps {
  onInstall: () => void;
  onDismiss: () => void;
}

export const PWAInstallBanner: React.FC<PWAInstallBannerProps> = ({
  onInstall,
  onDismiss,
}) => {
  return (
    <div className="fixed bottom-4 inset-x-4 max-w-md mx-auto z-50 animate-liquid-spring">
      <div className="bg-white rounded-3xl p-4 shadow-xl flex items-center justify-between gap-3">
        {/* App Icon & Text */}
        <div className="flex items-center gap-3">
          <img
            src="/bookr-favicon.svg"
            alt="BOOKR"
            className="w-10 h-10 rounded-2xl object-contain bg-[#0f382c] p-1.5 shrink-0"
          />
          <div>
            <h4 className="text-xs sm:text-sm font-black text-[#18241f] leading-tight">
              Install BOOKR
            </h4>
            <p className="text-[11px] text-[#5e6b64] leading-tight mt-0.5">
              Instant offline access on your home screen
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5 shrink-0">
          <Button
            variant="primary"
            size="sm"
            onClick={onInstall}
            className="text-xs px-3.5 py-1.5 font-bold"
          >
            <SolidDownload className="w-3.5 h-3.5" />
            <span>Install</span>
          </Button>

          <button
            onClick={onDismiss}
            className="w-7 h-7 rounded-full text-[#5e6b64] hover:text-[#18241f] hover:bg-black/[0.05] flex items-center justify-center cursor-pointer transition-colors"
            aria-label="Don't ask again"
            title="Don't show again"
          >
            <SolidClose className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
