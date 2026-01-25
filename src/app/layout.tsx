import "./globals.css";
import { Inter } from "next/font/google";
import AuthGuard from "../components/AuthGuard"; // Opcional: mover a lógica de auth para um componente separado

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Retenção Start",
  description: "Plataforma de Treinamentos",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br" className="scroll-smooth">
      <body className={`${inter.className} bg-[#020617] text-slate-200 antialiased`}>
          {children}
      </body>
    </html>
  );
}