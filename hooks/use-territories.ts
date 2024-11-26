import { useState, useEffect } from 'react';
import { Territory } from '@/types/sales-rep';

export function useTerritories() {
  const [territories, setTerritories] = useState<Territory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTerritories();
  }, []);

  const fetchTerritories = async () => {
    try {
      const response = await fetch('/api/territories');
      if (!response.ok) throw new Error('Failed to fetch territories');
      const data = await response.json();
      setTerritories(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const createTerritory = async (data: Omit<Territory, 'id'>) => {
    try {
      const response = await fetch('/api/territories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create territory');
      const newTerritory = await response.json();
      setTerritories([...territories, newTerritory]);
      return newTerritory;
    } catch (err) {
      throw err instanceof Error ? err : new Error('An error occurred');
    }
  };

  return {
    territories,
    loading,
    error,
    createTerritory,
    refetch: fetchTerritories,
  };
}