'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ProductsLayout({ children }) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="flex justify-between items-center bg-white px-6 py-4 shadow">
        <h1 className="text-xl font-bold text-gray-800">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="rounded bg-red-500 px-4 py-2 text-sm text-white hover:bg-red-600"
        >
          Logout
        </button>
      </header>
      <main className="p-6">{children}</main>
    </div>
  );
}