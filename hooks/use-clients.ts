"use client";

import { useState } from 'react';
import { Client } from '@prisma/client';

export function useClients() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createClient = async (data: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) => {
    setLoading(true);
    try {
      const response = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) throw new Error('Failed to create client');
      
      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create client');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateClient = async (id: string, data: Partial<Client>) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/clients/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) throw new Error('Failed to update client');
      
      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update client');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteClient = async (id: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/clients/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to delete client');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete client');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getClients = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/clients');
      if (!response.ok) throw new Error('Failed to fetch clients');
      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch clients');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    createClient,
    updateClient,
    deleteClient,
    getClients,
  };
}