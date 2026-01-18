"use client";
import "./globals.css";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const isLogged = localStorage.getItem("@retencao-start:isLogged");

      if (!isLogged && pathname !== "/login") {
        router.push("/login");
      } else if (isLogged && pathname === "/login") {
        router.push("/");
      }
      setLoading(false);
    };

    checkAuth();
  }, [pathname, router]);

  return (
    <html lang="pt-br">
      <body className={`${inter.className} bg-[#020617] text-slate-200 antialiased`}>
        {/* Só mostramos o conteúdo se não estiver carregando a proteção, 
            ou se já estivermos na tela de login */}
        {loading && pathname !== "/login" ? (
          <div className="min-h-screen bg-[#020617]" />
        ) : (
          <main className="min-h-screen">
            {children}
          </main>
        )}
      </body>
    </html>
  );
}