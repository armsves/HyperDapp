'use client';

import { useQuery, useUpdateEntity } from '@graphprotocol/hypergraph-react';
import { GraphImage } from '../../Components/GraphImage';
import { Dapp } from '../schema';
import { useState } from 'react';

const SPACE_ID = '745bd24c-3bf7-4e1d-b413-cffadddd0c61';

export default function ShowcaseDappsPage() {
  const { data: dapps, isPending, refetch } = useQuery(Dapp, {
    mode: 'public',
    space: SPACE_ID,
    first: 200,
  });
  const updateDapp = useUpdateEntity(Dapp, { space: SPACE_ID });
  const [votingDapp, setVotingDapp] = useState<Dapp | null>(null);
  const [isVoting, setIsVoting] = useState(false);

  const handleVote = async (rating: number) => {
    if (!votingDapp) return;
    setIsVoting(true);
    try {
      const dappId = (votingDapp as unknown as { id: string }).id;
      await updateDapp(dappId, { rating });
      await refetch();
      setVotingDapp(null);
    } catch (err) {
      console.error('Failed to update rating:', err);
      alert('Failed to update rating. Check console for details.');
    } finally {
      setIsVoting(false);
    }
  };

  const renderStars = (rating: number | undefined, interactive = false, onClick?: () => void) => {
    const stars = [];
    const currentRating = rating || 0;
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={`${interactive ? 'cursor-pointer hover:text-yellow-400' : ''} ${
            i <= currentRating ? 'text-yellow-500' : 'text-gray-300'
          }`}
          onClick={onClick}
        >
          ★
        </span>
      );
    }
    return <div className="flex">{stars}</div>;
  };

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
          .filter((d) => d.active === true)
          .map((dapp) => (
            <div
              key={(dapp as unknown as { id: string }).id}
              className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-200 transform hover:-translate-y-1 z-10"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Category - Top Center */}
              {dapp.category && (
                <div className="absolute top-2 left-1/2 transform -translate-x-1/2 z-10">
                  <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full font-semibold">
                    {dapp.category}
                  </span>
                </div>
              )}

              {/* Rating - Top Right */}
              <div className="absolute top-2 right-2 z-10">
                {renderStars(dapp.rating, true, () => setVotingDapp(dapp))}
              </div>

              <div className="relative p-6 pt-10">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 overflow-hidden">
                  {dapp.image ? (
                    <GraphImage src={dapp.image} alt={`${dapp.name} image`} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-white font-bold text-lg">{dapp.name.charAt(0).toUpperCase()}</span>
                  )}
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors duration-300">
                  {dapp.name}
                </h3>
                {dapp.description && <p className="text-sm text-gray-600 mb-2 line-clamp-2">{dapp.description}</p>}
                {dapp.contract && (
                  <p className="text-xs font-mono text-gray-500">{dapp.contract.slice(0, 10)}…{dapp.contract.slice(-6)}</p>
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

      {/* Voting Modal */}
      {votingDapp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <h3 className="text-xl font-bold mb-4 text-center">Rate {votingDapp.name}</h3>
            <p className="text-gray-600 text-center mb-6">
              Current rating: {votingDapp.rating ? `${votingDapp.rating}/5` : 'Not rated'}
            </p>
            
            <div className="flex justify-center gap-2 mb-6">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  onClick={() => handleVote(rating)}
                  disabled={isVoting}
                  className="text-3xl hover:text-yellow-400 transition-colors disabled:opacity-50 text-gray-300 hover:scale-110 transform"
                >
                  ★
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setVotingDapp(null)}
                disabled={isVoting}
                className="flex-1 py-2 px-4 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
            
            {isVoting && (
              <p className="text-center text-sm text-blue-600 mt-2">Updating rating...</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}


