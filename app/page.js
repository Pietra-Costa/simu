// pages/index.js
'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push('/sign-in'); // Redireciona para a página de login
  }, [router]);

  return null; // Não renderiza nada na página inicial
}
