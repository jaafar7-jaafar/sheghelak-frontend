import { useState, useEffect } from 'react';
import progressService from '../services/progressService';

export function useProgress() {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProgress = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await progressService.getMyProgress();
      setProgress(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load progress.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgress();
  }, []);

  return { progress, loading, error, refetch: fetchProgress };
}
