import { create } from 'zustand';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

interface UiState {
  toasts: Toast[];
  mobileMenuOpen: boolean;
  
  showToast: (message: string, type?: Toast['type']) => void;
  removeToast: (id: string) => void;
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;
}

export const useUiStore = create<UiState>((set, get) => ({
  toasts: [],
  mobileMenuOpen: false,

  showToast: (message, type = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const toast: Toast = { id, message, type };
    set({ toasts: [...get().toasts, toast] });
    
    setTimeout(() => {
      get().removeToast(id);
    }, 3000);
  },

  removeToast: (id: string) => {
    set({ toasts: get().toasts.filter(t => t.id !== id) });
  },

  toggleMobileMenu: () => {
    set({ mobileMenuOpen: !get().mobileMenuOpen });
  },

  closeMobileMenu: () => {
    set({ mobileMenuOpen: false });
  },
}));
