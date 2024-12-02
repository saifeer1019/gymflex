'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import cookie from 'cookie';
import axios from 'axios';

export default function Logout() {
  const router = useRouter();

  useEffect(() => {
    // Clear user data from localStorage
    localStorage.removeItem('user');

   axios.post('/api/auth/logout');

    // Redirect to home page
    router.push('/');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Logging out...</p>
      </div>
    </div>
  );
} 