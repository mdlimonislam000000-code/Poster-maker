'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FiArrowLeft, FiHome, FiFileText, FiUser } from 'react-icons/fi';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const navLinks = [
    { name: 'Overview', href: '/dashboard/overview', icon: FiHome },
    { name: 'My Poster', href: '/dashboard/my-poster', icon: FiFileText },
    { name: 'Profile', href: '/dashboard/profile', icon: FiUser },
  ];

  return (
    <div className="flex h-screen bg-slate-950 text-white">
      {/* ১. শুধুমাত্র সাইডবার */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between p-4">
        <div className="space-y-4">
          <div className="text-xl font-black tracking-wider text-amber-400 p-2">
            🎨 Poster Maker
          </div>

          <nav className="space-y-2">
            {/* ব্যাক বাটন */}
            <button
              onClick={() => router.back()}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition font-medium text-sm text-slate-300 hover:bg-slate-800 hover:text-white cursor-pointer"
            >
              <FiArrowLeft className="text-lg" /> Back
            </button>

            {/* বাকি ৩টি রুট বাটন */}
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
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

      {/* ২. চাইল্ড পেজ কন্টেন্ট এলাকা (এখানে লেআউট থেকে অতিরিক্ত কিছু দেওয়া হয়নি) */}
      <main className="flex-1 overflow-y-auto p-8 bg-slate-950">
        {children}
      </main>
    </div>
  );
}