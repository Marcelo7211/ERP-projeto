import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WhiteLabelConfig {
  companyName: string;
  primaryColor: string;
  logoUrl: string;
}

interface AppState {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  config: WhiteLabelConfig;
  setConfig: (config: Partial<WhiteLabelConfig>) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      theme: 'dark',
      toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
      
      isSidebarOpen: true,
      toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
      
      config: {
        companyName: 'RealEstate ERP',
        primaryColor: '#3b82f6', // blue-500
        logoUrl: '',
      },
      setConfig: (newConfig) => set((state) => ({ 
        config: { ...state.config, ...newConfig } 
      })),
    }),
    {
      name: 'erp-imobiliario-storage',
      partialize: (state) => ({ theme: state.theme, config: state.config }),
    }
  )
);
