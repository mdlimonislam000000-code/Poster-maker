"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { authClient } from "@/lib/auth-client";
import { FiMenu, FiX, FiUser, FiHome, FiImage, FiPlusCircle, FiSettings, FiLogOut } from 'react-icons/fi';

const navItems = [
  { name: 'Home', path: '/', icon: FiImage },
  { name: 'New Poster', path: '/create-poster', icon: FiPlusCircle },
  { name: 'Template', path: '/templates', icon: FiSettings },
  { name: 'Dashboard', path: '/dashboard/profile', icon: FiHome },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Fetching dynamic user session using BetterAuth
  const { data: session, isPending } = authClient.useSession();

  const user = {
    name: session?.user?.name || "User",
    email: session?.user?.email || "",
    avatar: session?.user?.image || null,
  };

  const isActive = (path: string) => pathname === path;

  // Logout handler
  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login");
        },
      },
    });
  };

  return (
    <nav className="bg-slate-900 text-white shadow-xl sticky top-0 z-50 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Branding */}
          <div className="flex items-center">
            <Link href="/dashboard" className="flex-shrink-0 flex items-center gap-2.5">
              <div className="bg-amber-500 p-2 rounded-lg text-slate-900">
                <FiImage className="h-6 w-6 font-bold" />
              </div>
              <span className="text-xl font-bold tracking-tight">
                Poster<span className="text-amber-400">Maker</span>
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.name}
                  href={item.path}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200
                    ${active 
                      ? 'bg-slate-800 text-amber-400 shadow-sm border border-slate-700' 
                      : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'}`}
                >
                  <Icon className={`h-4 w-4 ${active ? 'text-amber-400' : 'text-slate-400'}`} />
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* Desktop Profile Section */}
          <div className="hidden md:flex items-center ml-4 border-l border-slate-800 pl-4 gap-4">
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-semibold text-white">
                  {isPending ? "Loading..." : user.name}
                </p>
                <p className="text-xs text-amber-400">Developer</p>
              </div>
              {user.avatar ? (
                <img className="h-10 w-10 rounded-full border-2 border-amber-500 object-cover" src={user.avatar} alt="User" />
              ) : (
                <div className="h-10 w-10 rounded-full bg-slate-800 border-2 border-amber-500/50 flex items-center justify-center text-amber-400 font-semibold">
                  <FiUser className="h-5 w-5" />
                </div>
              )}
            </div>

            {/* Logout Button */}
            <button
              onClick={handleSignOut}
              title="Logout"
              className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
            >
              <FiLogOut className="h-5 w-5" />
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none"
            >
              {isOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.name}
                href={item.path}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-base font-medium
                  ${active
                    ? 'bg-slate-800 text-amber-400 border border-slate-700'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
                onClick={() => setIsOpen(false)}
              >
                <Icon className={`h-5 w-5 ${active ? 'text-amber-400' : 'text-slate-400'}`} />
                {item.name}
              </Link>
            );
          })}
          
          <div className="pt-4 mt-2 border-t border-slate-800 flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-slate-800 border-2 border-amber-500/50 flex items-center justify-center text-amber-400">
                <FiUser className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-semibold text-white">{user.name}</div>
                <div className="text-xs text-amber-400">Developer</div>
              </div>
            </div>

            <button
              onClick={handleSignOut}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 text-xs font-medium hover:bg-red-500/20 transition-colors"
            >
              <FiLogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;