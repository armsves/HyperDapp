'use client';

import { useHypergraphApp, useHypergraphAuth } from '@graphprotocol/hypergraph-react';
import Image from 'next/image';
import Link from 'next/link';

export default function HomePage() {
  const { redirectToConnect } = useHypergraphApp();
  const { authenticated } = useHypergraphAuth();

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

  return (
    <div className="min-h-screen bg-[#4B0082] overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-[#3D9BE9]/20 to-[#E940A9]/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-[#E940A9]/20 to-[#3D9BE9]/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-[#3D9BE9]/10 to-[#E940A9]/10 rounded-full blur-3xl animate-spin-slow"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <div className="mb-8 relative">
            <Image 
              src="/hyperdapp-logo.png" 
              alt="HyperDapp Logo" 
              width={120} 
              height={120} 
              className="w-30 h-30 mx-auto mb-6 drop-shadow-2xl animate-float rounded-full" 
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#3D9BE9]/20 to-[#E940A9]/20 rounded-full blur-xl"></div>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-[#3D9BE9] via-[#F5F5F5] to-[#E940A9] bg-clip-text text-transparent animate-gradient">
            HyperDapp
          </h1>
          
          <p className="text-xl md:text-2xl text-[#F5F5F5] mb-4 font-light">
            The Future of Decentralized Applications
          </p>
          
          <p className="text-lg text-[#B0B0B0] mb-12 max-w-3xl mx-auto leading-relaxed">
            Discover, create, and showcase cutting-edge dApps in a decentralized ecosystem. 
            Built on Hypergraph technology for seamless web3 experiences.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link href="/public-space/745bd24c-3bf7-4e1d-b413-cffadddd0c61">
              <button className="px-8 py-4 rounded-xl bg-gradient-to-r from-[#3D9BE9] to-[#E940A9] text-[#F5F5F5] font-semibold text-lg hover:scale-105 transform transition-all duration-300 shadow-2xl hover:shadow-[#3D9BE9]/25">
                Explore dApps
              </button>
            </Link>
            
            {authenticated ? (
              <Link href="/private-space/c7967341-e422-4b1d-aa36-bfe8ee56aae1">
                <button className="px-8 py-4 rounded-xl border-2 border-[#3D9BE9] text-[#3D9BE9] font-semibold text-lg hover:bg-[#3D9BE9]/10 hover:scale-105 transform transition-all duration-300">
                  Submit dApp
                </button>
              </Link>
            ) : (
              <button 
                onClick={handleSignIn}
                className="px-8 py-4 rounded-xl border-2 border-[#3D9BE9] text-[#3D9BE9] font-semibold text-lg hover:bg-[#3D9BE9]/10 hover:scale-105 transform transition-all duration-300"
              >
                Get Started
              </button>
            )}
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20">
          {/* Feature 1: Discover */}
          <div className="group relative bg-[#1E1B2E]/80 backdrop-blur-sm rounded-2xl p-8 border border-[#3D9BE9]/20 hover:border-[#3D9BE9] transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-[#3D9BE9]/25">
            <div className="absolute inset-0 bg-gradient-to-br from-[#3D9BE9]/5 to-[#E940A9]/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-gradient-to-br from-[#3D9BE9] to-[#E940A9] rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-[#F5F5F5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-[#F5F5F5] mb-4 text-center">Discover</h3>
              <p className="text-[#B0B0B0] text-center leading-relaxed">
                Explore a curated collection of innovative dApps across DeFi, Gaming, Social, and more. Find the perfect tools for your web3 journey.
              </p>
            </div>
          </div>

          {/* Feature 2: Create */}
          <div className="group relative bg-[#1E1B2E]/80 backdrop-blur-sm rounded-2xl p-8 border border-[#3D9BE9]/20 hover:border-[#E940A9] transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-[#E940A9]/25">
            <div className="absolute inset-0 bg-gradient-to-br from-[#E940A9]/5 to-[#3D9BE9]/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-gradient-to-br from-[#E940A9] to-[#3D9BE9] rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-[#F5F5F5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-[#F5F5F5] mb-4 text-center">Create</h3>
              <p className="text-[#B0B0B0] text-center leading-relaxed">
                Submit your own dApps to the ecosystem. Share your innovations with the community and get discovered by users worldwide.
              </p>
            </div>
          </div>

          {/* Feature 3: Rate */}
          <div className="group relative bg-[#1E1B2E]/80 backdrop-blur-sm rounded-2xl p-8 border border-[#3D9BE9]/20 hover:border-[#4ADE80] transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-[#4ADE80]/25">
            <div className="absolute inset-0 bg-gradient-to-br from-[#4ADE80]/5 to-[#3D9BE9]/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-gradient-to-br from-[#4ADE80] to-[#3D9BE9] rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-[#F5F5F5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-[#F5F5F5] mb-4 text-center">Rate & Review</h3>
              <p className="text-[#B0B0B0] text-center leading-relaxed">
                Help the community by rating and reviewing dApps. Your feedback drives quality and helps others discover the best applications.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="text-center mb-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-[#3D9BE9] mb-2">∞</div>
              <div className="text-[#B0B0B0] text-sm">Possibilities</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-[#E940A9] mb-2">6</div>
              <div className="text-[#B0B0B0] text-sm">Categories</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-[#4ADE80] mb-2">★★★★★</div>
              <div className="text-[#B0B0B0] text-sm">Community Driven</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-[#F5F5F5] mb-2">Web3</div>
              <div className="text-[#B0B0B0] text-sm">Powered</div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-[#1E1B2E]/60 backdrop-blur-sm rounded-3xl p-12 border border-[#3D9BE9]/20 max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-[#F5F5F5] mb-6">
            Ready to Shape the Future?
          </h2>
          <p className="text-lg text-[#B0B0B0] mb-8 max-w-2xl mx-auto">
            Join the HyperDapp ecosystem today. Whether you're a developer, user, or enthusiast, 
            there's a place for you in the decentralized future.
          </p>
          
          {!authenticated && (
            <button 
              onClick={handleSignIn}
              className="px-10 py-4 rounded-xl bg-gradient-to-r from-[#3D9BE9] to-[#E940A9] text-[#F5F5F5] font-semibold text-xl hover:scale-105 transform transition-all duration-300 shadow-2xl hover:shadow-[#3D9BE9]/25"
            >
              Connect Your Wallet
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
