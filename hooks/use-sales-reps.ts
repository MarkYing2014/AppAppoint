"use client";

import { useState } from 'react';
import { SalesRep } from '@prisma/client';

export function useSalesReps() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createSalesRep = async (data: Omit<SalesRep, 'id' | 'createdAt' | 'updatedAt'>) => {
    setLoading(true);
    try {
      const response = await fetch('/api/sales-reps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) throw new Error('Failed to create sales rep');
      
      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create sales rep');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateSalesRep = async (id: string, data: Partial<SalesRep>) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/sales-reps/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) throw new Error('Failed to update sales rep');
      
      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update sales rep');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteSalesRep = async (id: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/sales-reps/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to delete sales rep');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete sales rep');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getSalesReps = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/sales-reps');
      if (!response.ok) throw new Error('Failed to fetch sales reps');
      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch sales reps');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    createSalesRep,
    updateSalesRep,
    deleteSalesRep,
    getSalesReps,
  };
}