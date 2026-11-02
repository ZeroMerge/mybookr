import React from 'react';
import { SolidTrendingUp, SolidTrendingDown, SolidPackage } from './ui/icons';
import { UserSettings } from '@/types';

interface NavbarProps {
  currentTab: 'sales' | 'expenses' | 'inventory';
  setCurrentTab: (tab: 'sales' | 'expenses' | 'inventory') => void;
  settings: UserSettings;
  isSettingsOpen: boolean;
  onToggleSettings: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  settings,
  isSettingsOpen,
  onToggleSettings,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FAF9F6]/85 backdrop-blur-xl">
      <div className="max-w-2xl mx-auto px-4 pt-3 pb-2 flex flex-col gap-2.5">
        
        {/* Top Header: Pure Wordmark Logo on Left, Hamburger/X on Right */}
        <div className="flex items-center justify-between">
          
          {/* Wordmark Logo (no circles, no duplicate text) */}
          <img
            src="/bookr-logo.png"
            alt="BOOKR"
            className="h-6 sm:h-7 w-auto object-contain select-none"
          />

          {/* Right: Hamburger button with clean morph to X */}
          <button
            onClick={onToggleSettings}
            className="w-9 h-9 rounded-full bg-black/[0.04] hover:bg-black/[0.08] active:scale-95 transition-all flex flex-col justify-center items-center gap-[4.5px] cursor-pointer select-none p-1.5"
            aria-label={isSettingsOpen ? 'Close settings menu' : 'Open settings menu'}
            title={isSettingsOpen ? 'Close' : 'Settings'}
          >
            <span
              className={`block h-[2px] w-4 bg-[#0f382c] rounded-full transition-all duration-300 origin-center ${
                isSettingsOpen ? 'rotate-45 translate-y-[6.5px]' : ''
              }`}
            />
            <span
              className={`block h-[2px] w-4 bg-[#0f382c] rounded-full transition-all duration-200 ${
                isSettingsOpen ? 'opacity-0 scale-0' : 'opacity-100'
              }`}
            />
            <span
              className={`block h-[2px] w-4 bg-[#0f382c] rounded-full transition-all duration-300 origin-center ${
                isSettingsOpen ? '-rotate-45 -translate-y-[6.5px]' : ''
              }`}
            />
          </button>
        </div>

        {/* Apple Segmented Control Switcher */}
        <div className="inline-flex self-start items-center p-1 rounded-full bg-black/[0.05] gap-1 overflow-x-auto max-w-full">
          {/* Sales Tab */}
          <button
            onClick={() => setCurrentTab('sales')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all duration-200 flex items-center gap-1.5 ${
              currentTab === 'sales'
                ? 'bg-white text-[#0f382c]'
                : 'text-[#5e6b64] hover:text-[#18241f]'
            }`}
          >
            <SolidTrendingUp className="w-3.5 h-3.5" />
            <span>Sales</span>
          </button>

          {/* Expenses Tab */}
          <button
            onClick={() => setCurrentTab('expenses')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all duration-200 flex items-center gap-1.5 ${
              currentTab === 'expenses'
                ? 'bg-white text-[#0f382c]'
                : 'text-[#5e6b64] hover:text-[#18241f]'
            }`}
          >
            <SolidTrendingDown className="w-3.5 h-3.5" />
            <span>Expenses</span>
          </button>

          {/* Inventory Tab */}
          {settings.inventoryEnabled && (
            <button
              onClick={() => setCurrentTab('inventory')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all duration-200 flex items-center gap-1.5 ${
                currentTab === 'inventory'
                  ? 'bg-white text-[#0f382c]'
                  : 'text-[#5e6b64] hover:text-[#18241f]'
              }`}
            >
              <SolidPackage className="w-3.5 h-3.5" />
              <span>Inventory</span>
            </button>
          )}
        </div>

      </div>
    </header>
  );
};
