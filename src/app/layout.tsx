import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'LinkPilot - AI Internal Linking Planner',
  description: 'AI-powered internal linking and content refresh planner for small publishers',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
