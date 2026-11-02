import React, { useState, useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, updateSettings, DEFAULT_SETTINGS } from '@/lib/db';
import { Navbar } from '@/components/Navbar';
import { SalesView } from '@/components/SalesView';
import { ExpensesView } from '@/components/ExpensesView';
import { InventoryView } from '@/components/InventoryView';
import { RecordSaleModal } from '@/components/RecordSaleModal';
import { RecordExpenseModal } from '@/components/RecordExpenseModal';
import { SettingsModal } from '@/components/SettingsModal';
import { OnboardingModal } from '@/components/OnboardingModal';
import { PWAInstallBanner } from '@/components/PWAInstallBanner';
import { Button } from '@/components/ui/button';
import { SolidPlus } from '@/components/ui/icons';
import { formatMoney, getTimeGreeting, getFriendlyLocation } from '@/lib/utils';
import { usePWA } from '@/hooks/usePWA';

export function App() {
  const [currentTab, setCurrentTab] = useState<'sales' | 'expenses' | 'inventory'>('sales');
  
  // PWA install controller
  const { showBanner, canInstall, install, dismiss } = usePWA();

  // Modals state
  const [isRecordSaleOpen, setIsRecordSaleOpen] = useState(false);
  const [isRecordExpenseOpen, setIsRecordExpenseOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Pure live queries
  const rawSales = useLiveQuery(() => db.sales.toArray(), []) ?? [];
  const rawExpenses = useLiveQuery(() => db.expenses.toArray(), []) ?? [];
  const inventory = useLiveQuery(() => db.inventory.toArray(), []) ?? [];
  const dbSettings = useLiveQuery(() => db.settings.toCollection().first(), []);

  // Safe settings merge
  const settings = useMemo(() => {
    return dbSettings || DEFAULT_SETTINGS;
  }, [dbSettings]);

  // Sort sales and expenses in memory safely
  const sales = useMemo(() => {
    return [...rawSales].sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });
  }, [rawSales]);

  const expenses = useMemo(() => {
    return [...rawExpenses].sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });
  }, [rawExpenses]);

  // Dynamic greeting based on time of day & location
  const timeGreeting = useMemo(() => getTimeGreeting(), []);
  const location = useMemo(() => getFriendlyLocation(settings.location), [settings.location]);
  const displayName = settings.userName || 'Friend';

  // Onboarding completion handler
  const handleCompleteOnboarding = async (mode: 'local' | 'cloud') => {
    await updateSettings({
      hasCompletedOnboarding: true,
      storageMode: mode,
    });
  };

  // Financial totals
  const totalPaidSalesKobo = sales
    .filter((s) => s.paymentStatus === 'paid')
    .reduce((acc, s) => acc + s.amount, 0);

  const totalOwingKobo = sales
    .filter((s) => s.paymentStatus === 'owing')
    .reduce((acc, s) => acc + s.amount, 0);

  const totalRestockKobo = expenses
    .filter((e) => e.expenseType === 'restock')
    .reduce((acc, e) => acc + e.amount, 0);

  const totalChopKobo = expenses
    .filter((e) => e.expenseType === 'chop_money')
    .reduce((acc, e) => acc + e.amount, 0);

  const totalExpensesKobo = totalRestockKobo + totalChopKobo;

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#18241f] flex flex-col font-sans">
      
      {/* Apple-style Navigation Header */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        settings={settings}
        isSettingsOpen={isSettingsOpen}
        onToggleSettings={() => setIsSettingsOpen(!isSettingsOpen)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-4 space-y-4">
        
        {/* Apple Hero Header */}
        <section className="flex items-center justify-between pt-1">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-[#18241f] tracking-tight">
              {timeGreeting}, {displayName}
            </h1>
          </div>
          <span className="text-[11px] font-bold text-[#5e6b64] px-3 py-1 rounded-full bg-black/[0.04]">
            {location}
          </span>
        </section>

        {/* Apple Financial Balance Card */}
        <div className="rounded-3xl p-5 bg-white space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#5e6b64]">Total Cash Made</span>
            <span className="text-[11px] font-bold text-[#0f382c] px-2.5 py-0.5 rounded-full bg-[#0f382c]/10">
              Live Ledger
            </span>
          </div>

          {/* Large Bold Balance */}
          <div className="text-3xl sm:text-4xl font-black text-[#0f382c] tracking-tight">
            {formatMoney(totalPaidSalesKobo)}
          </div>

          {/* Flow Indicator Pills */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-800 text-xs font-bold">
              ↑ {formatMoney(totalPaidSalesKobo)} in
            </div>
            <div className="px-3 py-1 rounded-full bg-rose-500/10 text-rose-800 text-xs font-bold">
              ↓ {formatMoney(totalExpensesKobo)} out
            </div>
            {totalOwingKobo > 0 && (
              <div className="px-3 py-1 rounded-full bg-amber-500/15 text-amber-900 text-xs font-bold">
                ⏳ {formatMoney(totalOwingKobo)} owing
              </div>
            )}
          </div>

          {/* Instant Quick Action Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-black/[0.04]">
            <Button
              variant="primary"
              size="md"
              onClick={() => setIsRecordSaleOpen(true)}
              className="w-full justify-center"
            >
              <SolidPlus className="w-3.5 h-3.5" />
              <span>Record Sale</span>
            </Button>

            <Button
              variant="secondary"
              size="md"
              onClick={() => setIsRecordExpenseOpen(true)}
              className="w-full justify-center"
            >
              <span>Record Expense</span>
            </Button>
          </div>
        </div>

        {/* Tab 1: Sales View */}
        {currentTab === 'sales' && (
          <SalesView
            sales={sales}
            onOpenRecordModal={() => setIsRecordSaleOpen(true)}
          />
        )}

        {/* Tab 2: Expenses View */}
        {currentTab === 'expenses' && (
          <ExpensesView
            expenses={expenses}
            onOpenRecordModal={() => setIsRecordExpenseOpen(true)}
          />
        )}

        {/* Tab 3: Inventory View */}
        {currentTab === 'inventory' && settings.inventoryEnabled && (
          <InventoryView inventory={inventory} />
        )}

      </main>

      {/* Modals & Bottom Sheets */}
      <RecordSaleModal
        isOpen={isRecordSaleOpen}
        onClose={() => setIsRecordSaleOpen(false)}
        inventoryItems={inventory}
      />

      <RecordExpenseModal
        isOpen={isRecordExpenseOpen}
        onClose={() => setIsRecordExpenseOpen(false)}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        sales={sales}
        expenses={expenses}
        inventory={inventory}
        canInstall={canInstall}
        onInstall={install}
      />

      {/* Onboarding Dialog */}
      <OnboardingModal
        isOpen={!settings.hasCompletedOnboarding}
        onComplete={handleCompleteOnboarding}
      />

      {/* PWA Install Banner (Only shows once until accepted or dismissed; never annoys) */}
      {showBanner && (
        <PWAInstallBanner
          onInstall={install}
          onDismiss={dismiss}
        />
      )}

    </div>
  );
}

export default App;
