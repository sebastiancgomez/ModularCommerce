'use client';
import { useNotificationStore } from '@/store/useNotificationStore';

export default function NotificationToast() {
  const { notifications } = useNotificationStore();

  if (notifications.length === 0) return null;

  return (
    <div className="toast-container">
      {notifications.map((n) => (
        <div key={n.id} className="toast-item">
          <span style={{ fontSize: '1.2rem' }}>
            {n.type === 'success' ? '🛒' : '⚠️'}
          </span>
          <span style={{ fontWeight: '500' }}>{n.message}</span>
        </div>
      ))}
    </div>
  );
}