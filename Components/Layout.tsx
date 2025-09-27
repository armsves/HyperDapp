'use client';

import { useHypergraphApp, useHypergraphAuth } from '@graphprotocol/hypergraph-react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
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
    <div className="min-h-full flex flex-col">
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 relative z-[9998]">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <NavigationMenu viewport={false}>
              <NavigationMenuList>
                

              <NavigationMenuItem>
                <NavigationMenuLink
                  href="/public-space/745bd24c-3bf7-4e1d-b413-cffadddd0c61"
                  className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground disabled:pointer-events-none disabled:opacity-50 data-[state=open]:hover:bg-accent data-[state=open]:text-accent-foreground data-[state=open]:focus:bg-accent data-[state=open]:bg-accent/50 focus-visible:ring-ring/50 outline-none transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1"
                >
                  dApps Showcase
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink
                  href="/private-space/c7967341-e422-4b1d-aa36-bfe8ee56aae1"
                  className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground disabled:pointer-events-none disabled:opacity-50 data-[state=open]:hover:bg-accent data-[state=open]:text-accent-foreground data-[state=open]:focus:bg-accent data-[state=open]:bg-accent/50 focus-visible:ring-ring/50 outline-none transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1"
                >
                  Submit dApp
                </NavigationMenuLink>
              </NavigationMenuItem>

              </NavigationMenuList>
            </NavigationMenu>

            {/* Auth Button */}
            <div className="flex items-center space-x-4">
              {isAdmin && (
                <Button asChild variant="outline">
                  <Link href="/admin/dapps">Admin</Link>
                </Button>
              )}
              {walletAddress && (
                <div
                  onClick={handleCopy}
                  role="button"
                  tabIndex={0}
                  title={copied ? 'Copied!' : 'Click to copy'}
                  className="hidden md:flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-mono bg-background/50 cursor-pointer hover:bg-accent/50"
                >
                  <span className="opacity-70">{copied ? 'Copied' : 'Wallet'}</span>
                  <span>{`${walletAddress.slice(0, 6)}…${walletAddress.slice(-4)}`}</span>
                </div>
              )}
              {authenticated ? (
                <Button onClick={handleLogout} variant="outline">
                  Logout
                </Button>
              ) : (
                <Button onClick={handleSignIn}>Sign in with Geo Connect</Button>
              )}
            </div>
          </div>
        </div>
      </nav>
      <main className="flex-1 container mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
