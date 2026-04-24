import { create } from 'zustand';

interface Notification {
  id: number;
  message: string;
  type: 'success' | 'error';
}

interface NotificationStore {
  notifications: Notification[];
  addNotification: (message: string, type?: 'success' | 'error') => void;
  removeNotification: (id: number) => void;
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],
  addNotification: (message, type = 'success') => {
    const id = Date.now();
    set((state) => ({
      notifications: [...state.notifications, { id, message, type }]
    }));
    // Auto-eliminar después de 3 segundos
    setTimeout(() => {
      set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== id)
      }));
    }, 3000);
  },
  removeNotification: (id) => set((state) => ({
    notifications: state.notifications.filter((n) => n.id !== id)
  })),
}));