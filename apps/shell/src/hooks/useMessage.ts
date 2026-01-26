import { useState, useCallback } from 'react';

interface Message {
  type: 'success' | 'error';
  text: string;
}

interface UseMessageReturn {
  message: Message | null;
  showMessage: (type: 'success' | 'error', text: string) => void;
  clearMessage: () => void;
}

export function useMessage(autoDismissMs = 3000): UseMessageReturn {
  const [message, setMessage] = useState<Message | null>(null);

  const showMessage = useCallback((type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    if (autoDismissMs > 0) {
      setTimeout(() => setMessage(null), autoDismissMs);
    }
  }, [autoDismissMs]);

  const clearMessage = useCallback(() => {
    setMessage(null);
  }, []);

  return { message, showMessage, clearMessage };
}
