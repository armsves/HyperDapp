'use client';

import {
  HypergraphSpaceProvider,
  preparePublish,
  publishOps,
  useCreateEntity,
  useHypergraphApp,
  useQuery,
  useSpace,
  useSpaces,
} from '@graphprotocol/hypergraph-react';
import { useState } from 'react';

import { Dapp } from '@/app/schema';
import { Button } from '../ui/button';

export function PrivateSpaceWrapper({ spaceid }: Readonly<{ spaceid: string }>) {
  return (
    <HypergraphSpaceProvider space={spaceid}>
      <PrivateSpace />
    </HypergraphSpaceProvider>
  );
}

function PrivateSpace() {
  const { name, ready, id: spaceId } = useSpace({ mode: 'private' });
  const { data: dapps } = useQuery(Dapp, { mode: 'private' });
  const { data: publicSpaces } = useSpaces({ mode: 'public' });
  const [selectedSpace, setSelectedSpace] = useState<string>('');
  const createDapp = useCreateEntity(Dapp);
  const [dappName, setDappName] = useState('');
  const [dappDescription, setDappDescription] = useState('');
  const [dappCategory, setDappCategory] = useState('');
  const [dappContract, setDappContract] = useState('');
  const [dappImageUrl, setDappImageUrl] = useState('');
  const { getSmartSessionClient } = useHypergraphApp();

  if (!ready) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#4B0082]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3D9BE9] mx-auto mb-4"></div>
          <p className="text-[#F5F5F5]">Loading space...</p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await createDapp({
        name: dappName,
        description: dappDescription || undefined,
        category: dappCategory || undefined,
        contract: dappContract || undefined,
        active: false,
        image: dappImageUrl || undefined,
      });
      setDappName('');
      setDappDescription('');
      setDappCategory('');
      setDappContract('');
      setDappImageUrl('');
    } catch (err) {
      console.error(err);
      alert('Failed to create dApp');
    }
  };

  const publishToPublicSpace = async (dapp: Dapp) => {
    if (!selectedSpace) {
      alert('No space selected');
      return;
    }
    try {
      const { ops } = await preparePublish({ entity: dapp, publicSpace: selectedSpace });
      const smartSessionClient = await getSmartSessionClient();
      if (!smartSessionClient) {
        throw new Error('Missing smartSessionClient');
      }
      const publishResult = await publishOps({
        ops,
        space: selectedSpace,
        name: 'Publish Dapp',
        walletClient: smartSessionClient,
      });
      console.log(publishResult, ops);
      alert('Dapp published to public space');
    } catch (error) {
      console.error(error);
      alert('Error publishing dapp to public space');
    }
  };

  return (
    <div className="min-h-screen bg-[#4B0082]">
      <div className="container mx-auto px-4 py-4 max-w-4xl">

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Create Dapp Form */}
          <div className="space-y-6">
            <div className="bg-[#1E1B2E] border border-[#3D9BE9]/20 rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-[#F5F5F5] mb-4">Create New dApp</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="dapp-name" className="text-sm font-medium text-[#F5F5F5]">
                    dApp Name
                  </label>
                  <input
                    id="dapp-name"
                    type="text"
                    value={dappName}
                    onChange={(e) => setDappName(e.target.value)}
                    placeholder="Enter dApp name..."
                    className="w-full px-3 py-2 border border-[#B0B0B0]/30 bg-[#4B0082]/20 text-[#F5F5F5] placeholder-[#B0B0B0] rounded-md text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#3D9BE9] focus:border-[#3D9BE9]"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="dapp-image" className="text-sm font-medium text-[#F5F5F5]">
                    Image URL
                  </label>
                  <input
                    id="dapp-image"
                    type="text"
                    value={dappImageUrl}
                    onChange={(e) => setDappImageUrl(e.target.value)}
                    placeholder="https://... or ipfs://..."
                    className="w-full px-3 py-2 border border-[#B0B0B0]/30 bg-[#4B0082]/20 text-[#F5F5F5] placeholder-[#B0B0B0] rounded-md text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#3D9BE9] focus:border-[#3D9BE9]"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="dapp-category" className="text-sm font-medium text-[#F5F5F5]">
                      Category
                    </label>
                    <select
                      id="dapp-category"
                      value={dappCategory}
                      onChange={(e) => setDappCategory(e.target.value)}
                      className="w-full px-3 py-2 border border-[#B0B0B0]/30 bg-[#4B0082]/20 text-[#F5F5F5] rounded-md text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#3D9BE9] focus:border-[#3D9BE9] [&>option]:bg-white [&>option]:text-black"
                    >
                      <option value="" className="bg-white text-black">Select a category...</option>
                      <option value="DeFi" className="bg-white text-black">DeFi</option>
                      <option value="Gaming" className="bg-white text-black">Gaming</option>
                      <option value="Social" className="bg-white text-black">Social</option>
                      <option value="Tools" className="bg-white text-black">Tools</option>
                      <option value="NFT" className="bg-white text-black">NFT</option>
                      <option value="Infrastructure" className="bg-white text-black">Infrastructure</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="dapp-contract" className="text-sm font-medium text-[#F5F5F5]">
                      Contract Address
                    </label>
                    <input
                      id="dapp-contract"
                      type="text"
                      value={dappContract}
                      onChange={(e) => setDappContract(e.target.value)}
                      placeholder="0x..."
                      className="w-full px-3 py-2 border border-[#B0B0B0]/30 bg-[#4B0082]/20 text-[#F5F5F5] placeholder-[#B0B0B0] rounded-md text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#3D9BE9] focus:border-[#3D9BE9] font-mono"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="dapp-description" className="text-sm font-medium text-[#F5F5F5]">
                    Description
                  </label>
                  <textarea
                    id="dapp-description"
                    rows={3}
                    value={dappDescription}
                    onChange={(e) => setDappDescription(e.target.value)}
                    placeholder="What does your dApp do?"
                    className="w-full px-3 py-2 border border-[#B0B0B0]/30 bg-[#4B0082]/20 text-[#F5F5F5] placeholder-[#B0B0B0] rounded-md text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#3D9BE9] focus:border-[#3D9BE9] resize-none"
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={!dappName.trim()}
                  className="w-full px-4 py-2 rounded-md bg-gradient-to-r from-[#3D9BE9] to-[#E940A9] text-[#F5F5F5] hover:from-[#3D9BE9]/80 hover:to-[#E940A9]/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
                >
                  Create dApp
                </button>
              </form>
            </div>
          </div>

          {/* dApps List */}
          <div className="space-y-6">
            <div className="bg-[#1E1B2E] border border-[#3D9BE9]/20 rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-[#F5F5F5] mb-4">
                Your dApps ({dapps?.length || 0})
              </h2>

              {dapps && dapps.length > 0 ? (
                <div className="space-y-4">
                  {dapps.map((dapp) => (
                    <div key={dapp.id} className="border border-[#3D9BE9]/20 rounded-lg p-4 bg-[#4B0082]/20">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium text-[#F5F5F5]">{dapp.name}</h3>
                        {dapp.category && <span className="text-xs bg-[#E940A9]/20 text-[#E940A9] px-2 py-1 rounded-full font-semibold">{dapp.category}</span>}
                      </div>

                      <div className="flex items-center justify-between mb-3">
                        <p className="text-xs text-[#B0B0B0] font-mono">ID: {dapp.id}</p>
                      </div>

                      {dapp.description && (
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-sm text-[#B0B0B0]">{dapp.description}</p>
                        </div>
                      )}

                      {dapp.contract && (
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-xs font-mono text-[#B0B0B0]">{dapp.contract}</p>
                        </div>
                      )}

                      <div className="space-y-3">
                        <div className="space-y-2">
                          <label htmlFor="space" className="text-xs font-medium text-[#B0B0B0]">
                            Select Public Space to Publish
                          </label>
                          <select
                            name="space"
                            value={selectedSpace}
                            onChange={(e) => setSelectedSpace(e.target.value)}
                            className="w-full px-3 py-2 border border-[#B0B0B0]/30 bg-[#4B0082]/20 text-[#F5F5F5] rounded-md text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#3D9BE9] focus:border-[#3D9BE9] [&>option]:bg-white [&>option]:text-black"
                          >
                            <option value="" className="bg-white text-black">Choose a public space...</option>
                            {publicSpaces?.map((space) => (
                              <option key={space.id} value={space.id} className="bg-white text-black">
                                {space.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <button
                          onClick={() => publishToPublicSpace(dapp)}
                          disabled={!selectedSpace}
                          className="w-full px-3 py-2 rounded-md border border-[#3D9BE9] text-[#3D9BE9] hover:bg-[#3D9BE9]/20 hover:text-[#F5F5F5] disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm font-medium"
                        >
                          Publish to Public Space
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-[#3D9BE9] mb-2">
                    <svg
                      className="mx-auto h-12 w-12 mb-4 opacity-50"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      />
                    </svg>
                  </div>
                  <p className="text-[#F5F5F5]">No dApps created yet</p>
                  <p className="text-sm text-[#B0B0B0] mt-1">Create your first dApp using the form</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

