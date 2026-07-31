import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Common/Navbar';
import { CustomerDashboard } from './components/Customer/CustomerDashboard';
import { SupplierDashboard } from './components/Supplier/SupplierDashboard';
import { AdminDashboard } from './components/Admin/AdminDashboard';

function MainAppContent() {
  const { activeRole, language } = useApp();

  return (
    <div className={`min-h-screen bg-slate-950 text-slate-100 ${language === 'ur' ? 'font-urdu' : ''}`} dir={language === 'ur' ? 'rtl' : 'ltr'}>
      <Navbar />

      <main className="transition-all duration-300">
        {activeRole === 'customer' && <CustomerDashboard />}
        {activeRole === 'supplier' && <SupplierDashboard />}
        {activeRole === 'admin' && <AdminDashboard />}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
