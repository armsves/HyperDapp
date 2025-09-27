'use client';

import { useEffect, useState } from 'react';
import { useCreateEntity, useHypergraphAuth, useHypergraphApp, useSpaces, preparePublish, publishOps } from '@graphprotocol/hypergraph-react';
import { Dapp } from '../schema';

const SPACE_ID = '0b126676-15ca-49a2-9833-c0cb5ebad947';

export default function SubmitDappPage() {
  const { authenticated } = useHypergraphAuth();
  const { redirectToConnect, getSmartSessionClient, createSpace } = useHypergraphApp();

  // Load user's private spaces to use as source for publishing
  const { data: privateSpaces = [], isPending: loadingSpaces } = useSpaces({ mode: 'private' });
  const [selectedSourceSpace, setSelectedSourceSpace] = useState<string | undefined>(undefined);
  const [loadStalled, setLoadStalled] = useState(false);

  useEffect(() => {
    if (!selectedSourceSpace && privateSpaces.length > 0) {
      setSelectedSourceSpace(privateSpaces[0].id);
    }
  }, [privateSpaces, selectedSourceSpace]);

  useEffect(() => {
    if (authenticated && loadingSpaces) {
      const timer = setTimeout(() => setLoadStalled(true), 5000);
      return () => clearTimeout(timer);
    }
    setLoadStalled(false);
  }, [authenticated, loadingSpaces]);

  const createDapp = useCreateEntity(Dapp, { space: selectedSourceSpace });

  const [status, setStatus] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const handleSignIn = () => {
    redirectToConnect({
      storage: localStorage,
      connectUrl: 'https://connect.geobrowser.io/',
      successUrl: `${window.location.origin}/authenticate-success`,
      redirectFn: (url: URL) => {
        window.location.href = url.toString();
      },
    });
  };

  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (!authenticated) return handleSignIn();
    if (!selectedSourceSpace) {
      setStatus('Please select a private source space first');
      return;
    }
    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get('name') || '').trim();
    const description = String(formData.get('description') || '').trim();
    const category = String(formData.get('category') || '').trim();
    const contract = String(formData.get('contract') || '').trim();
    const ratingRaw = String(formData.get('rating') || '').trim();
    const rating = ratingRaw ? Number(ratingRaw) : undefined;
    const active = false; // default to inactive until admin approves
    const imageUrl = String(formData.get('imageUrl') || '').trim();

    if (!name) {
      setStatus('Name is required');
      return;
    }

    setPending(true);
    setStatus('Uploading…');
    try {
      const dapp = await createDapp({
        name,
        description: description || undefined,
        category: category || undefined,
        contract: contract || undefined,
        rating,
        active,
        image: imageUrl || undefined,
      });
      // Publish to public space per docs
      const { ops } = await preparePublish({ entity: dapp, publicSpace: SPACE_ID });
      const walletClient = await getSmartSessionClient();
      await publishOps({ ops, walletClient, space: SPACE_ID, name: 'Create Dapp' });
      setStatus('Submitted successfully! Pending admin approval.');
      form.reset();
    } catch (err) {
      console.error(err);
      setStatus('Submission failed');
    } finally {
      setPending(false);
    }
  };

  const handleCreateSourceSpace = async () => {
    try {
      setPending(true);
      const client = await getSmartSessionClient();
      const id = await createSpace({ name: 'My Private Space', smartSessionClient: client });
      setSelectedSourceSpace(id);
      setStatus('Created a private space. You can submit now.');
    } catch (err) {
      console.error(err);
      setStatus('Failed to create private space');
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10">
      <h1 className="text-4xl font-bold text-center mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        Submit a dApp
      </h1>
      <p className="text-center text-muted-foreground mb-6">1) Choose a private source space 2) Submit dApp → it will be published to public space {SPACE_ID}.</p>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 mb-6">
        <label className="block text-sm font-medium mb-1">Select your private source space</label>
        {!authenticated ? (
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm text-muted-foreground">Sign in to load your private spaces.</span>
            <button onClick={handleSignIn} className="px-3 py-2 rounded-md bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              Sign in
            </button>
          </div>
        ) : loadingSpaces ? (
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm text-muted-foreground">
              {loadStalled ? 'Still loading your spaces…' : 'Loading your spaces…'}
            </span>
            {loadStalled && (
              <div className="flex items-center gap-2">
                <button onClick={() => window.location.reload()} className="px-3 py-2 rounded-md border">Refresh</button>
                <button onClick={handleCreateSourceSpace} className="px-3 py-2 rounded-md bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                  Create Private Space
                </button>
              </div>
            )}
          </div>
        ) : privateSpaces.length > 0 ? (
          <select
            value={selectedSourceSpace}
            onChange={(e) => setSelectedSourceSpace(e.target.value)}
            className="w-full border rounded-md px-3 py-2"
          >
            {privateSpaces.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name || 'Untitled'} — {s.id}
              </option>
            ))}
          </select>
        ) : (
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm text-muted-foreground">No private spaces found.</span>
            <button onClick={handleCreateSourceSpace} className="px-3 py-2 rounded-md bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              Create Private Space
            </button>
          </div>
        )}
      </div>

      <form onSubmit={onSubmit} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="name">Name</label>
          <input id="name" name="name" required className="w-full border rounded-md px-3 py-2" placeholder="My Awesome dApp" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="imageUrl">Image URL</label>
          <input id="imageUrl" name="imageUrl" className="w-full border rounded-md px-3 py-2" placeholder="https://... or ipfs://..." />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="category">Category</label>
            <input id="category" name="category" className="w-full border rounded-md px-3 py-2" placeholder="DeFi, Social, Tools…" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="contract">Contract Address</label>
            <input id="contract" name="contract" className="w-full border rounded-md px-3 py-2 font-mono" placeholder="0x…" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="rating">Rating (0-5)</label>
            <input id="rating" name="rating" type="number" step="0.1" min={0} max={5} className="w-full border rounded-md px-3 py-2" />
          </div>
          <div className="flex items-center gap-2 mt-6 text-xs text-muted-foreground">
            Pending admin approval. Submissions are inactive by default.
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="description">Description</label>
          <textarea id="description" name="description" rows={4} className="w-full border rounded-md px-3 py-2" placeholder="What does your dApp do?" />
        </div>

        <button disabled={pending} className="w-full py-3 rounded-md text-white font-medium bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 transition-colors disabled:opacity-60">
          {pending ? 'Submitting…' : 'Submit dApp'}
        </button>

        {status && <p className="text-center text-sm text-muted-foreground">{status}</p>}
      </form>
    </div>
  );
}


