import { CheckCircle2Icon, XCircleIcon, InfoIcon, XIcon } from 'lucide-react';
import { useEffect, useState } from 'react';


type AlertType = 'success' | 'error' | 'info';

interface AlertMessage {
  id: number;
  type: AlertType;
  title: string;
  message: string;
}

interface FlashProps {
  success?: string;
  error?: string;
  info?: string;
}

interface AlertProps {
  flash?: FlashProps;
  autoCloseDelay?: number; // миллисекунды, по умолчанию 5000
}

const defaultTitles = {
  success: 'Успешно',
  error: 'Ошибка',
  info: 'Информация',
};

const styles = {
  success: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-800',
    icon: CheckCircle2Icon,
  },
  error: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-800',
    icon: XCircleIcon,
  },
  info: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-800',
    icon: InfoIcon,
  },
};

export default function Alert({ flash, autoCloseDelay = 5000 }: AlertProps) {
    const [alerts, setAlerts] = useState<AlertMessage[]>([]);

    // Добавляем сообщения при изменении flash
    useEffect(() => {
        if (!flash) {
            return;
        }

        const newAlerts: AlertMessage[] = [];

        (Object.keys(flash) as AlertType[]).forEach((type) => {
        const message = flash[type];

        if (message && typeof message === 'string') {
            newAlerts.push({
            id: Date.now() + Math.random() * 10000,
            type,
            title: defaultTitles[type],
            message,
            });
        }
        });

        if (newAlerts.length) {
            setAlerts((prev) => [...prev, ...newAlerts]);
        }
    }, [flash]);

    // Автоматическое удаление через autoCloseDelay
    useEffect(() => {
        const timers = alerts.map((alert) =>
        setTimeout(() => {
            setAlerts((prev) => prev.filter((a) => a.id !== alert.id));
        }, autoCloseDelay)
        );

        return () => timers.forEach(clearTimeout);
    }, [alerts, autoCloseDelay]);

    const removeAlert = (id: number) => {
        setAlerts((prev) => prev.filter((a) => a.id !== id));
    };

    if (alerts.length === 0) {
        return null;
    }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-md w-full">
      {alerts.map((alert) => {
        const Icon = styles[alert.type].icon;

        return (
          <div
            key={alert.id}
            className={`rounded-lg border p-4! ${styles[alert.type].bg} ${styles[alert.type].border} ${styles[alert.type].text} shadow-md transition-all duration-300`}
          >
            <div className="flex items-start gap-3">
              <Icon className="h-5 w-5 shrink-0" />
              <div className="flex-1">
                <h4 className="font-semibold">{alert.title}</h4>
                <p className="text-sm mt-0.5">{alert.message}</p>
              </div>
              <button onClick={() => removeAlert(alert.id)} className="text-current opacity-60 hover:opacity-100">
                <XIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
