'use client';

import { useMemo, useState } from 'react';
import { useCreateEntity, useHypergraphAuth, useHypergraphApp } from '@graphprotocol/hypergraph-react';
import { Dapp, Image } from '../schema';

const SPACE_ID = '7945e940-c7bb-4982-92fe-ebc1a25b59ba';

export default function SubmitDappPage() {
  const { authenticated } = useHypergraphAuth();
  const { redirectToConnect } = useHypergraphApp();
  const createImage = useCreateEntity(Image, { space: SPACE_ID });
  const createDapp = useCreateEntity(Dapp, { space: SPACE_ID });

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
    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get('name') || '').trim();
    const description = String(formData.get('description') || '').trim();
    const category = String(formData.get('category') || '').trim();
    const contract = String(formData.get('contract') || '').trim();
    const ratingRaw = String(formData.get('rating') || '').trim();
    const rating = ratingRaw ? Number(ratingRaw) : undefined;
    const active = formData.get('active') === 'on';
    const imageUrl = String(formData.get('imageUrl') || '').trim();

    if (!name) {
      setStatus('Name is required');
      return;
    }

    setPending(true);
    setStatus('Uploading…');
    try {
      const img = imageUrl ? await createImage({ url: imageUrl }) : null;
      await createDapp({
        name,
        description: description || undefined,
        category: category || undefined,
        contract: contract || undefined,
        rating,
        active,
        image: img ? [img.id] : [],
      });
      setStatus('Submitted successfully!');
      form.reset();
    } catch (err) {
      console.error(err);
      setStatus('Submission failed');
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10">
      <h1 className="text-4xl font-bold text-center mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        Submit a dApp
      </h1>
      <p className="text-center text-muted-foreground mb-8">Published to Hypergraph space {SPACE_ID}.</p>

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
          <label className="flex items-center gap-2 mt-6">
            <input type="checkbox" name="active" className="h-4 w-4" defaultChecked />
            <span className="text-sm">Active</span>
          </label>
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


