import { useEffect, useState } from 'react';
import { AlertCircle, X } from 'lucide-react';

export default function ErrorToasts() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handleError = (event) => {
      const id = `${Date.now()}-${Math.random()}`;
      const message = event.detail || 'Something went wrong.';

      setToasts((current) => [...current, { id, message }].slice(-3));
      window.setTimeout(() => {
        setToasts((current) => current.filter((toast) => toast.id !== id));
      }, 4800);
    };

    window.addEventListener('sonic:error', handleError);
    return () => window.removeEventListener('sonic:error', handleError);
  }, []);

  if (toasts.length === 0) {
    return null;
  }

  return (
    <div className="fixed right-4 top-4 z-[100] flex w-[min(360px,calc(100vw-2rem))] flex-col gap-3">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="flex items-start gap-3 rounded-md border border-red-500/30 bg-[#241516] px-4 py-3 text-sm text-white shadow-2xl"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-300" />
          <p className="min-w-0 flex-1 leading-5 text-red-50">{toast.message}</p>
          <button
            type="button"
            aria-label="Dismiss error"
            onClick={() => setToasts((current) => current.filter((item) => item.id !== toast.id))}
            className="rounded-full p-1 text-red-100/70 transition hover:bg-white/10 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}

