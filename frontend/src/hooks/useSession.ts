import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const SESSION_KEY = 'across_assist_session';

export function useSession() {
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeSession = async () => {
      const storedToken = localStorage.getItem(SESSION_KEY);
      if (storedToken) {
        setSessionToken(storedToken);
        setIsLoading(false);
        return;
      }

      try {
        const response = await api.post('sessions/start');
        if (response.data?.success && response.data?.data?.sessionToken) {
          const token = response.data.data.sessionToken;
          localStorage.setItem(SESSION_KEY, token);
          setSessionToken(token);
        }
      } catch (error) {
        console.error('Failed to initialize session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeSession();
  }, []);

  const updateStep = useCallback(async (step: number, formData: any) => {
    if (!sessionToken) return;
    try {
      await api.patch(`/sessions/${sessionToken}/step`, { step, formData });
    } catch (error) {
      console.error('Failed to update session step:', error);
    }
  }, [sessionToken]);

  const updateEmail = useCallback(async (email: string) => {
    if (!sessionToken) return;
    try {
      await api.patch(`/sessions/${sessionToken}/email`, { email });
    } catch (error) {
      console.error('Failed to capture email:', error);
    }
  }, [sessionToken]);

  return { sessionToken, isLoading, updateStep, updateEmail };
}
