import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Frepay — Encontre prestadores de serviço perto de você",
  description: "Encontre eletricistas, encanadores, técnicos de ar condicionado e outros profissionais disponíveis agora na sua região. Contato direto via WhatsApp.",
  keywords: "prestador de serviço, eletricista, encanador, ar condicionado, marido de aluguel, perto de mim",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${inter.className} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
