'use client';

import { HypergraphSpaceProvider, useQuery, useSpace, useUpdateEntity, preparePublish, publishOps, useHypergraphApp } from '@graphprotocol/hypergraph-react';
import Image from 'next/image';
import { useState } from 'react';

import { Dapp } from '@/app/schema';

function isValidUrl(string: string): boolean {
  try {
    new URL(string);
    return true;
  } catch {
    return false;
  }
}

export function PublicSpaceWrapper({ spaceid }: Readonly<{ spaceid: string }>) {
  return (
    <HypergraphSpaceProvider space={spaceid}>
      <PublicSpace />
    </HypergraphSpaceProvider>
  );
}

function PublicSpace() {
  const { getSmartSessionClient } = useHypergraphApp();
  const { ready, id: spaceId } = useSpace({ mode: 'public' });
  const { data: dapps, isPending, refetch } = useQuery(Dapp, { mode: 'public' });
  const updateDapp = useUpdateEntity(Dapp, { space: "c7967341-e422-4b1d-aa36-bfe8ee56aae1" });
  const [votingDapp, setVotingDapp] = useState<Dapp | null>(null);
  const [isVoting, setIsVoting] = useState(false);

  const handleVote = async (rating: number) => {
    if (!votingDapp || !ready || !spaceId) {
      alert('Space not ready. Please try again.');
      return;
    }
    setIsVoting(true);
    try {
      const dappId = (votingDapp as unknown as { id: string }).id;
      console.log('Updating dapp:', dappId, 'in private space with rating:', rating);
      
      // Step 1: Update the entity in the private space
      const updatedEntity = await updateDapp(dappId, { rating });
      console.log('Updated entity:', updatedEntity);
      
      // Step 2: Prepare the updated entity for publishing
      const { ops } = await preparePublish({ entity: updatedEntity, publicSpace: spaceId });
      console.log('Prepared ops for publishing:', ops);
      
      // Step 3: Get smart session client
      const smartSessionClient = await getSmartSessionClient();
      if (!smartSessionClient) {
        throw new Error('Missing smartSessionClient');
      }
      
      // Step 4: Publish to the public space
      const publishResult = await publishOps({
        ops,
        space: spaceId,
        name: 'Update Dapp Rating',
        walletClient: smartSessionClient,
      });
      console.log('Published to public space:', publishResult);
      
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

  if (!ready) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-slate-600 text-lg">Loading space...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen ">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Dapps Showcase</h1>
          </div>
        </div>
      </div>

      {isPending && <div className="text-center py-16">Loading…</div>}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {dapps.map((dapp) => (
            <div
              key={(dapp as unknown as { id: string }).id}
              className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-200 transform hover:-translate-y-1 z-10"
            >
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Content */}
              <div className="relative p-6">
                {/* Image, Category, Rating - Horizontal Line */}
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 overflow-hidden">
                    {dapp.image && isValidUrl(dapp.image) ? (
                      <Image src={dapp.image} alt={`${dapp.name} image`} width={48} height={48} className="w-full h-full object-cover rounded-xl" />
                    ) : (
                      <span className="text-white font-bold text-lg">{dapp.name.charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  
                  <div className="flex-1 flex justify-center">
                    {dapp.category && (
                      <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full font-semibold">
                        {dapp.category}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center">
                    {renderStars(dapp.rating, true, () => setVotingDapp(dapp))}
                  </div>
                </div>

                {/* Project name */}
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                  {dapp.name}
                </h3>

                Rating: <p className="text-sm text-gray-600 mb-2 line-clamp-2">{dapp.rating}</p>
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">{dapp.contract}</p>

                {/* Project description */}
                {dapp.description && (
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">{dapp.description}</p>
                )}

                {/* Project xUrl */}
                {dapp.xUrl && (
                  <a
                    href={dapp.xUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-800 transition-colors duration-200 flex items-center gap-1"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                    View on X
                  </a>
                )}
              </div>

              {/* Decorative corner accent */}
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 opacity-10 group-hover:opacity-20 transition-opacity duration-300 transform rotate-45 translate-x-8 -translate-y-8" />
            </div>
          ))}
        </div>

        {/* Empty state */}
        {isPending === false && dapps.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No dapps Found</h3>
            <p className="text-gray-500">There are currently no public dapps available to explore.</p>
          </div>
        )}
      </div>

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
          </div>
        </div>
      )}
    </div>
  );
}
