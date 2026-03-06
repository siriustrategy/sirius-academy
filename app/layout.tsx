import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Sirius Academy — A sua revolução com IA começa aqui',
  description: 'Aprenda IA para marketing do zero ao avançado. Sistema gamificado com XP, fases e exercícios práticos.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;900&family=DM+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
