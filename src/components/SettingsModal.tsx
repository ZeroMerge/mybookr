import React, { useState } from 'react';
import { Button } from './ui/button';
import { Toggle } from './ui/toggle';
import { SolidDownload, SolidCheck, SolidClose } from './ui/icons';
import { UserSettings, Sale, Expense, InventoryItem } from '@/types';
import { updateSettings, db } from '@/lib/db';
import { getFriendlyLocation } from '@/lib/utils';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: UserSettings;
  sales: Sale[];
  expenses: Expense[];
  inventory: InventoryItem[];
  canInstall?: boolean;
  onInstall?: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  sales,
  expenses,
  canInstall,
  onInstall,
}) => {
  const [userName, setUserName] = useState(settings.userName || '');
  const [hustleName, setHustleName] = useState(settings.hustleName || '');
  const [location, setLocation] = useState(settings.location || '');
  const [inventoryEnabled, setInventoryEnabled] = useState(settings.inventoryEnabled);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const autoLocation = getFriendlyLocation(location);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSettings({
      userName: userName.trim() || 'Friend',
      hustleName: hustleName.trim() || 'My Business',
      location: location.trim(),
      inventoryEnabled,
    });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 300);
  };

  const handleExportCSV = () => {
    let csv = 'Type,Date,Description,Amount (NGN),Category,Debtor\n';

    sales.forEach((s) => {
      const date = new Date(s.createdAt).toISOString().split('T')[0];
      const amount = (s.amount / 100).toFixed(2);
      csv += `Sale,${date},"${s.itemName}",${amount},${s.paymentStatus},"${s.debtorName || ''}"\n`;
    });

    expenses.forEach((e) => {
      const date = new Date(e.createdAt).toISOString().split('T')[0];
      const amount = (e.amount / 100).toFixed(2);
      csv += `Expense,${date},"${e.description}",${amount},${e.expenseType},""\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `bookr-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleClearData = async () => {
    if (window.confirm('Delete all records and start fresh? This cannot be undone.')) {
      await db.sales.clear();
      await db.expenses.clear();
      await db.inventory.clear();
      window.location.reload();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
      />

      <div className="relative z-50 w-full max-w-lg bg-white rounded-t-[32px] p-6 text-[#18241f] max-h-[85vh] overflow-y-auto animate-liquid-spring">
        
        <div className="w-10 h-1 rounded-full bg-black/15 mx-auto mb-4" />

        <div className="flex items-center justify-between pb-3">
          <h2 className="text-base font-extrabold text-[#0f382c]">
            Settings
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/[0.04] text-[#5e6b64] hover:text-[#0f382c] flex items-center justify-center cursor-pointer transition-colors"
          >
            <SolidClose className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-3.5 pt-1">
          <div>
            <label className="block text-xs font-semibold text-[#18241f] mb-1">
              Your Name
            </label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="e.g. Samuel"
              className="w-full px-4 py-2.5 bg-black/[0.04] focus:bg-black/[0.07] rounded-2xl text-sm font-medium text-[#18241f] focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#18241f] mb-1">
              Shop Name
            </label>
            <input
              type="text"
              value={hustleName}
              onChange={(e) => setHustleName(e.target.value)}
              placeholder="e.g. Samuel's Store"
              className="w-full px-4 py-2.5 bg-black/[0.04] focus:bg-black/[0.07] rounded-2xl text-sm font-medium text-[#18241f] focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#18241f] mb-1">
              Location
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder={autoLocation}
              className="w-full px-4 py-2.5 bg-black/[0.04] focus:bg-black/[0.07] rounded-2xl text-sm font-medium text-[#18241f] focus:outline-none transition-colors"
            />
          </div>

          <div className="pt-2">
            <Toggle
              label="Inventory Tab"
              description="Keep track of physical items you sell."
              checked={inventoryEnabled}
              onChange={setInventoryEnabled}
            />
          </div>

          {/* Install PWA Button (If supported/installable) */}
          {canInstall && onInstall && (
            <div className="pt-2">
              <Button
                type="button"
                variant="lemonade"
                size="md"
                onClick={onInstall}
                className="w-full justify-center text-xs font-bold"
              >
                <SolidDownload className="w-4 h-4" />
                <span>Install BOOKR on Home Screen</span>
              </Button>
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full justify-center text-sm font-bold"
          >
            {savedSuccess ? (
              <span className="flex items-center gap-1.5">
                <SolidCheck className="w-4 h-4" /> Saved!
              </span>
            ) : (
              'Save Changes'
            )}
          </Button>

          <div className="pt-2 space-y-2">
            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={handleExportCSV}
              className="w-full justify-center text-xs"
            >
              <SolidDownload className="w-4 h-4" />
              <span>Export CSV Spreadsheet</span>
            </Button>

            <button
              type="button"
              onClick={handleClearData}
              className="w-full py-2 text-xs font-semibold text-rose-600 hover:text-rose-700 rounded-full cursor-pointer transition-colors"
            >
              Clear All Data
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
