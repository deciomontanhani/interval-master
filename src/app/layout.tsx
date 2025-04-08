import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { GameProvider } from "@/context/GameContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "IntervalMaster - Treinamento de Intervalos Musicais",
  description: "Um jogo interativo para treinar seu reconhecimento de intervalos musicais.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <GameProvider>
          {children}
        </GameProvider>
      </body>
    </html>
  );
}
