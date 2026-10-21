import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DeviceProvider } from './context/DeviceContext';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { Footer } from './components/layout/Footer';
import { AndroidDeviceSimulator } from './components/simulator/AndroidDeviceSimulator';

// Pages
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { VerifyEmailPage } from './pages/VerifyEmailPage';
import { DashboardPage } from './pages/DashboardPage';
import { MyDevicesPage } from './pages/MyDevicesPage';
import { DeviceDetailsPage } from './pages/DeviceDetailsPage';
import { LocationPage } from './pages/LocationPage';
import { RemoteControlsPage } from './pages/RemoteControlsPage';
import { LostModePage } from './pages/LostModePage';
import { CustomLostMessagePage } from './pages/CustomLostMessagePage';
import { SecurityCenterPage } from './pages/SecurityCenterPage';
import { EventHistoryPage } from './pages/EventHistoryPage';
import { AccountSettingsPage } from './pages/AccountSettingsPage';

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();
  
  // Navigation state initialized from URL hash or default
  const [currentPage, setCurrentPage] = useState<string>(() => {
    const hash = window.location.hash.replace('#/', '');
    return hash || 'dashboard';
  });

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigateTo = (page: string) => {
    setCurrentPage(page);
    setIsMobileMenuOpen(false);
    window.location.hash = `#/${page}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#/', '');
      if (hash) setCurrentPage(hash);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F8FA] dark:bg-[#0A0F1C] flex flex-col items-center justify-center space-y-4">
        <div className="w-8 h-8 rounded-full border-2 border-blue-600 border-t-transparent animate-spin"></div>
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 tracking-wider">Loading SecureLock...</p>
      </div>
    );
  }

  // Auth Route Pages (only shown when explicitly visited e.g. #/login, #/register)
  if (currentPage === 'login') {
    return <LoginPage onNavigate={navigateTo} />;
  }
  if (currentPage === 'register') {
    return <RegisterPage onNavigate={navigateTo} />;
  }
  if (currentPage === 'verify-email') {
    return <VerifyEmailPage onNavigate={navigateTo} />;
  }

  // Authenticated Routes
  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage onNavigate={navigateTo} />;
      case 'devices':
        return <MyDevicesPage onNavigate={navigateTo} />;
      case 'device-details':
        return <DeviceDetailsPage onNavigate={navigateTo} />;
      case 'location':
        return <LocationPage onNavigate={navigateTo} />;
      case 'controls':
        return <RemoteControlsPage onNavigate={navigateTo} />;
      case 'lost-mode':
        return <LostModePage onNavigate={navigateTo} />;
      case 'lost-message':
        return <CustomLostMessagePage onNavigate={navigateTo} />;
      case 'security':
        return <SecurityCenterPage onNavigate={navigateTo} />;
      case 'history':
        return <EventHistoryPage onNavigate={navigateTo} />;
      case 'settings':
        return <AccountSettingsPage onNavigate={navigateTo} />;
      default:
        return <DashboardPage onNavigate={navigateTo} />;
    }
  };

  return (
    <DeviceProvider>
      <div className="min-h-screen bg-[#F7F8FA] dark:bg-[#0A0F1C] text-[#111827] dark:text-[#F9FAFB] flex flex-col font-sans selection:bg-blue-600/20 selection:text-blue-700 dark:selection:text-blue-300 transition-colors duration-200">
        
        {/* Top Navbar */}
        <Navbar 
          onNavigate={navigateTo} 
          currentPage={currentPage}
          onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          isMobileMenuOpen={isMobileMenuOpen}
        />

        {/* Main Body Layout with Sidebar */}
        <div className="flex-1 flex max-w-[1920px] w-full mx-auto relative">
          <Sidebar 
            currentPage={currentPage} 
            onNavigate={navigateTo} 
            isMobileOpen={isMobileMenuOpen}
            onMobileClose={() => setIsMobileMenuOpen(false)}
          />

          <main className="flex-1 p-4 lg:p-8 overflow-y-auto w-full min-w-0">
            {renderCurrentPage()}
          </main>
        </div>

        {/* Footer */}
        <Footer />

        {/* Live Interactive Android Companion Phone Simulator (Synchronized) */}
        <AndroidDeviceSimulator />

      </div>
    </DeviceProvider>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}
