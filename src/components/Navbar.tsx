'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { authClient } from "@/lib/auth-client";
import { FiMenu, FiX, FiUser, FiHome, FiImage, FiPlusCircle, FiSettings, FiLogOut, FiLogIn } from 'react-icons/fi';

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

  const { data: session, isPending } = authClient.useSession();

  const user = session?.user ? {
    name: session.user.name || "User",
    email: session.user.email || "",
    avatar: (session.user as any).image || null,
  } : null;

  const isActive = (path: string) => pathname === path;

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

          {/* Desktop Profile / Login Section */}
          <div className="hidden md:flex items-center ml-4 border-l border-slate-800 pl-4 gap-4">
            {isPending ? (
              <div className="text-xs text-slate-400">Loading...</div>
            ) : user ? (
              <>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-semibold text-white">{user.name}</p>
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

                <button
                  onClick={handleSignOut}
                  title="Logout"
                  className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
                >
                  <FiLogOut className="h-5 w-5" />
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition shadow-lg shadow-amber-400/10"
              >
                <FiLogIn className="h-4 w-4" />
                লগইন
              </Link>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none"
            >
              <FiMenu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Sliding Sidebar (Right Side) */}
      <div className={`fixed inset-y-0 right-0 z-50 w-72 bg-slate-900 border-l border-slate-800 p-5 flex flex-col justify-between transform transition-transform duration-300 ease-in-out md:hidden ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="bg-amber-500 p-2 rounded-lg text-slate-900">
                <FiImage className="h-5 w-5 font-bold" />
              </div>
              <span className="text-lg font-bold tracking-tight text-white">
                Poster<span className="text-amber-400">Maker</span>
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <FiX className="h-6 w-6" />
            </button>
          </div>

          {/* Mobile Nav Links */}
          <div className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.name}
                  href={item.path}
                  className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium transition-colors
                    ${active
                      ? 'bg-amber-400 text-slate-950 font-bold shadow-lg'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
                  onClick={() => setIsOpen(false)}
                >
                  <Icon className={`h-5 w-5 ${active ? 'text-slate-950' : 'text-slate-400'}`} />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Mobile User & Logout Footer Section */}
        <div className="pt-4 border-t border-slate-800">
          {user ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-slate-800 border-2 border-amber-500/50 flex items-center justify-center text-amber-400 overflow-hidden">
                  {user.avatar ? (
                    <img src={user.avatar} alt="User" className="w-full h-full object-cover" />
                  ) : (
                    <FiUser className="h-5 w-5" />
                  )}
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">{user.name}</div>
                  <div className="text-xs text-amber-400">Developer</div>
                </div>
              </div>

              <button
                onClick={handleSignOut}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 text-red-400 text-xs font-semibold hover:bg-red-500/20 transition-colors"
              >
                <FiLogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs"
            >
              <FiLogIn className="h-4 w-4" />
              লগইন করুন
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;