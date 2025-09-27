'use client';

import { useHypergraphApp, useHypergraphAuth } from '@graphprotocol/hypergraph-react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useLayoutEffect, useState } from 'react';

import { SpacesMenu } from './SpacesMenu';
import { Button } from './ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from './ui/NavigationMenu';

export function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  const navigation = useRouter();
  const pathname = usePathname();

  const { authenticated, identity, privyIdentity } = useHypergraphAuth();
  const { redirectToConnect, logout } = useHypergraphApp();
  const walletAddress = identity?.accountAddress || privyIdentity?.accountAddress || null;
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!walletAddress) return;
    try {
      await navigator.clipboard.writeText(walletAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      // ignore
    }
  };

  useLayoutEffect(() => {
    if (
      pathname.startsWith('/login') ||
      pathname.startsWith('/authenticate-success') ||
      pathname === '/' ||
      pathname === '/explore-public-knowledge' ||
      pathname === '/explore-public-knowledge/projects' ||
      pathname === '/explore-public-knowledge/dapps' ||
      pathname === '/explore-public-knowledge/investors' ||
      pathname === '/explore-public-knowledge/investment-rounds' ||
      pathname === '/explore-public-knowledge/assets' ||
      pathname === '/dapps'
    ) {
      return;
    }

    // Only redirect to login if not authenticated and not already on login page
    if (!authenticated) {
      void navigation.push('/login');
    }
  }, [authenticated, pathname, navigation]);

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
  const handleLogout = () => {
    logout();
    navigation.push('/login');
  };
  const isAdmin = (identity?.accountAddress || privyIdentity?.accountAddress || '').toLowerCase() ===
    '0x141ea27023ceef7d45611889699849cb267d89ca';

  return (
    <div className="min-h-full flex flex-col bg-[#4B0082]">
      <nav className="border-b border-[#3D9BE9]/20 bg-[#1E1B2E]/95 backdrop-blur supports-[backdrop-filter]:bg-[#1E1B2E]/60 relative z-[9998]">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center">
                <Image
                  src="/hyperdapp-logo.png"
                  alt="HyperDapp"
                  width={32}
                  height={32}
                  className="h-8 w-8"
                />
              </Link>
              <NavigationMenu viewport={false}>
              <NavigationMenuList>
                

              <NavigationMenuItem>
                <NavigationMenuLink
                  href="/public-space/745bd24c-3bf7-4e1d-b413-cffadddd0c61"
                  className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium text-[#F5F5F5] hover:bg-[#3D9BE9]/20 hover:text-[#3D9BE9] focus:bg-[#3D9BE9]/20 focus:text-[#3D9BE9] disabled:pointer-events-none disabled:opacity-50 outline-none transition-all"
                >
                  dApps Showcase
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink
                  href="/private-space/c7967341-e422-4b1d-aa36-bfe8ee56aae1"
                  className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium text-[#F5F5F5] hover:bg-[#3D9BE9]/20 hover:text-[#3D9BE9] focus:bg-[#3D9BE9]/20 focus:text-[#3D9BE9] disabled:pointer-events-none disabled:opacity-50 outline-none transition-all"
                >
                  Submit dApp
                </NavigationMenuLink>
              </NavigationMenuItem>

              </NavigationMenuList>
            </NavigationMenu>
            </div>

            {/* Auth Button */}
            <div className="flex items-center space-x-4">
              {isAdmin && (
                <Button asChild variant="outline" className="border-[#E940A9] text-[#E940A9] hover:bg-[#E940A9] hover:text-[#F5F5F5]">
                  <Link href="/admin/dapps">Admin</Link>
                </Button>
              )}
              {walletAddress && (
                <div
                  onClick={handleCopy}
                  role="button"
                  tabIndex={0}
                  title={copied ? 'Copied!' : 'Click to copy'}
                  className="hidden md:flex items-center gap-2 rounded-full border border-[#3D9BE9]/30 px-3 py-1 text-xs font-mono bg-[#1E1B2E]/50 cursor-pointer hover:bg-[#3D9BE9]/20 text-[#F5F5F5] transition-colors"
                >
                  <span className="text-[#B0B0B0]">{copied ? 'Copied' : 'Wallet'}</span>
                  <span>{`${walletAddress.slice(0, 6)}…${walletAddress.slice(-4)}`}</span>
                </div>
              )}
              {authenticated ? (
                <button 
                  onClick={handleLogout} 
                  className="px-4 py-2 rounded-md border border-[#B0B0B0]/30 text-[#F5F5F5] bg-transparent hover:bg-[#3D9BE9]/20 hover:text-[#3D9BE9] hover:border-[#3D9BE9] transition-all"
                >
                  Logout
                </button>
              ) : (
                <button 
                  onClick={handleSignIn} 
                  className="px-4 py-2 rounded-md bg-gradient-to-r from-[#3D9BE9] to-[#E940A9] text-[#F5F5F5] hover:from-[#3D9BE9]/80 hover:to-[#E940A9]/80 transition-all font-medium"
                >
                  Sign in with Geo Connect
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>
      <main className="flex-1 container mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
