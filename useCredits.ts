
import { useState, useEffect, useCallback } from 'react';
import { DAILY_CREDITS } from '../constants';

const CREDITS_KEY = 'bgzero_credits';
const LAST_REFILL_KEY = 'bgzero_last_refill';

export const useCredits = () => {
  const [credits, setCredits] = useState<number>(() => {
    const savedCredits = localStorage.getItem(CREDITS_KEY);
    return savedCredits ? parseInt(savedCredits, 10) : DAILY_CREDITS;
  });

  useEffect(() => {
    const checkAndRefillCredits = () => {
      const lastRefillStr = localStorage.getItem(LAST_REFILL_KEY);
      const now = new Date();
      
      if (lastRefillStr) {
        const lastRefillDate = new Date(lastRefillStr);
        const diff = now.getTime() - lastRefillDate.getTime();
        const hoursPassed = diff / (1000 * 60 * 60);

        if (hoursPassed >= 24) {
          setCredits(DAILY_CREDITS);
          localStorage.setItem(CREDITS_KEY, String(DAILY_CREDITS));
          localStorage.setItem(LAST_REFILL_KEY, now.toISOString());
        }
      } else {
        // First time user
        localStorage.setItem(CREDITS_KEY, String(DAILY_CREDITS));
        localStorage.setItem(LAST_REFILL_KEY, now.toISOString());
      }
    };

    checkAndRefillCredits();
  }, []);

  const spendCredits = useCallback((amount: number) => {
    setCredits(prev => {
      const newCredits = Math.max(0, prev - amount);
      localStorage.setItem(CREDITS_KEY, String(newCredits));
      return newCredits;
    });
  }, []);

  const addCredits = useCallback((amount: number) => {
    setCredits(prev => {
      const newCredits = prev + amount;
      localStorage.setItem(CREDITS_KEY, String(newCredits));
      return newCredits;
    });
  }, []);

  return { credits, spendCredits, addCredits };
};
