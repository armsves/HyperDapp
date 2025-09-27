'use client';

import { useMemo, useState } from 'react';
import { useHypergraphAuth, useQuery, useUpdateEntity } from '@graphprotocol/hypergraph-react';
import { Dapp } from '../../schema';

const SPACE_ID = '7945e940-c7bb-4982-92fe-ebc1a25b59ba';
const ADMIN_ADDRESS = '0x141EA27023cEEf7d45611889699849cB267d89ca'.toLowerCase();

export default function AdminDappsPage() {
  const { identity, privyIdentity } = useHypergraphAuth();
  const account = (identity?.accountAddress || privyIdentity?.accountAddress || '').toLowerCase();
  const { data: dapps, isPending, refetch } = useQuery(Dapp, {
    mode: 'public',
    space: SPACE_ID,
    first: 200,
  });
  const updateDapp = useUpdateEntity(Dapp, { space: SPACE_ID });
  const [savingId, setSavingId] = useState<string | null>(null);

  const isAdmin = account === ADMIN_ADDRESS;

  const sorted = useMemo(() => {
    return [...dapps].sort((a, b) => Number(b.active) - Number(a.active));
  }, [dapps]);

  if (!isAdmin) {
    return (
      <div className="max-w-xl mx-auto py-10 text-center">
        <h1 className="text-3xl font-bold">Admin Only</h1>
        <p className="text-muted-foreground mt-2">Connect with the admin wallet to manage submissions.</p>
      </div>
    );
  }

  const toggleActive = async (dapp: Dapp) => {
    try {
      setSavingId(dapp.id);
      await updateDapp({ id: dapp.id, active: !dapp.active });
      await refetch();
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Manage dApp Submissions
        </h1>
        <p className="text-muted-foreground">Approve or hide dApps in the showcase.</p>
      </div>

      {isPending && <div className="text-center py-16">Loading…</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sorted.map((dapp) => (
          <div key={dapp.id} className="border rounded-xl p-5 bg-white shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-lg">{dapp.name}</h3>
                <p className="text-xs text-muted-foreground font-mono mt-1">{dapp.id}</p>
                {dapp.category && <p className="text-xs text-purple-600 mt-1">{dapp.category}</p>}
                {dapp.description && <p className="text-sm text-gray-600 mt-2 line-clamp-3">{dapp.description}</p>}
              </div>
              <span
                className={
                  'inline-flex items-center h-6 px-2 rounded-full text-xs ' +
                  (dapp.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600')
                }
              >
                {dapp.active ? 'Active' : 'Inactive'}
              </span>
            </div>

            <button
              onClick={() => toggleActive(dapp)}
              disabled={savingId === dapp.id}
              className="mt-4 w-full py-2 rounded-md text-white font-medium bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:opacity-60"
            >
              {savingId === dapp.id ? 'Saving…' : dapp.active ? 'Deactivate' : 'Activate'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}


