'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { FiArrowLeft, FiHome, FiFileText, FiUser, FiMenu, FiX } from 'react-icons/fi';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navLinks = [
    { name: 'Overview', href: '/dashboard/overview', icon: FiHome },
    { name: 'My Poster', href: '/dashboard/my-poster', icon: FiFileText },
    { name: 'Profile', href: '/dashboard/profile', icon: FiUser },
  ];

  return (
    <div className="flex h-screen bg-slate-950 text-white overflow-hidden">
      {/* মোবাইল ওভারলে (Sidebar খোলা থাকলে ব্যাকগ্রাউন্ডে ডার্ক লেয়ার আসবে) */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm"
        />
      )}

      {/* সাইডবার (Mobile এ অফ-ক্যানভাস এবং Desktop এ স্ট্যাটিক) */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between p-4 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xl font-black tracking-wider text-amber-400 p-2">
            <span>🎨 Poster Maker</span>
            {/* মোবাইল স্ক্রিনে সাইডবার ক্লোজ করার জন্য ক্রস বাটন */}
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="md:hidden text-slate-400 hover:text-white"
            >
              <FiX className="text-2xl" />
            </button>
          </div>

          <nav className="space-y-2">
            {/* ব্যাক বাটন */}
            <button
              onClick={() => {
                router.back();
                setIsSidebarOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition font-medium text-sm text-slate-300 hover:bg-slate-800 hover:text-white cursor-pointer"
            >
              <FiArrowLeft className="text-lg" /> Back
            </button>

            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition font-medium text-sm ${
                    isActive
                      ? 'bg-amber-400 text-slate-950 font-bold shadow-lg'
                      : 'hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <Icon className="text-lg" /> {link.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* মেইন কন্টেন্ট এলাকা */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* মোবাইল হেডার (যেখানে হ্যামবার্গার মেনু বাটন থাকবে) */}
        <header className="md:hidden flex items-center justify-between bg-slate-900 border-b border-slate-800 px-4 py-3 z-30">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="text-slate-300 hover:text-white p-2 rounded-lg bg-slate-800"
          >
            <FiMenu className="text-xl" />
          </button>
          <span className="font-bold text-amber-400">🎨 Poster Maker</span>
          <div className="w-8" /> {/* স্পেস ব্যালেন্স করার জন্য */}
        </header>

        {/* চাইল্ড পেজ কন্টেন্ট */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-950">
          {children}
        </main>
      </div>
    </div>
  );
}