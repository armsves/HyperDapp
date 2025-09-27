'use client';

import { useQuery } from '@graphprotocol/hypergraph-react';
import { GraphImage } from '../../Components/GraphImage';
import { Dapp } from '../schema';

const SPACE_ID = '7945e940-c7bb-4982-92fe-ebc1a25b59ba';

export default function ShowcaseDappsPage() {
  const { data: dapps, isPending } = useQuery(Dapp, {
    mode: 'public',
    space: SPACE_ID,
    first: 200,
    include: { image: {} },
  });

  return (
    <div className="py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          HyperDapp Showcase
        </h1>
        <p className="text-muted-foreground mt-2">Discover dApps submitted by the community.</p>
      </div>

      {isPending && <div className="text-center py-16">Loading…</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {dapps
          .filter((d) => d.active !== false)
          .map((dapp) => (
            <div
              key={dapp.id}
              className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-200 transform hover:-translate-y-1 z-10"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="relative p-6">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 overflow-hidden">
                  {dapp.image?.[0]?.url ? (
                    <GraphImage src={dapp.image[0].url} alt={`${dapp.name} image`} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-white font-bold text-lg">{dapp.name.charAt(0).toUpperCase()}</span>
                  )}
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors duration-300">
                  {dapp.name}
                </h3>
                {dapp.category && <p className="text-xs text-purple-600 font-semibold mb-2">{dapp.category}</p>}
                {dapp.description && <p className="text-sm text-gray-600 mb-2 line-clamp-2">{dapp.description}</p>}
                {dapp.contract && (
                  <p className="text-xs font-mono text-gray-500">{dapp.contract.slice(0, 10)}…{dapp.contract.slice(-6)}</p>
                )}
                {typeof dapp.rating === 'number' && (
                  <div className="mt-2 text-sm">
                    <span className="text-yellow-500">{'★'.repeat(Math.max(0, Math.min(5, Math.round(dapp.rating))))}</span>
                    <span className="text-gray-400">{'☆'.repeat(5 - Math.max(0, Math.min(5, Math.round(dapp.rating))))}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
      </div>

      {isPending === false && dapps.length === 0 && (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Dapps Found</h3>
          <p className="text-gray-500">There are currently no dapps in the showcase space.</p>
        </div>
      )}
    </div>
  );
}


